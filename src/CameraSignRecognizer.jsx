// src/CameraSignRecognizer.jsx
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

/*
  CameraSignRecognizer

  - Uses Mediapipe Hands (from window.MP) to read hand landmarks
  - Classifies gestures using geometric rules
  - Stabilises over several frames + cooldown
  - Calls onRecognized(label) when a stable gesture is accepted
  - Shows:
      • Left: plain webcam
      • Right: processed view with points
      • Bottom: last recognised label
*/

export default function CameraSignRecognizer({ onRecognized }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  const [lastLabel, setLastLabel] = useState(null);

  // stability + state
  const stateRef = useRef({
    frameBuffer: [],        // recent candidate gestures (strings)
    wristXBuffer: [],       // recent wrist.x values for motion detection
    wristZBuffer: [],       // recent wrist.z values for forward motion
    lastAccepted: null,     // last accepted label
    cooldown: false,        // lockout after accept
    lastHandPresent: false, // used to reset buffer when hand disappears
  });

  // parameters (tweak if needed)
  const BUFSIZE = 12;
  const STABLE_THRESHOLD = 7;        // must appear >=7 times in last BUFSIZE frames
  const COOLDOWN_MS = 1800;          // ignore new accepts for this many ms
  const WAVE_VARIANCE_THRESHOLD = 0.03; // motion threshold for wave (x-axis)
  const START_FORWARD_THRESHOLD = 0.06; // wrist z forward movement for START

  // helper: euclidean distance
  function dist(a, b) {
    return Math.sqrt(
      (a.x - b.x) ** 2 +
      (a.y - b.y) ** 2 +
      (a.z - b.z) ** 2
    );
  }

  // core classifier: returns a candidate label (string) or null
  function classify(lm) {
    if (!lm) return null;

    const wrist = lm[0];

    // fingertips
    const thumbTip = lm[4];
    const indexTip = lm[8];
    const middleTip = lm[12];
    const ringTip = lm[16];
    const pinkyTip = lm[20];

    // MCP / PIP reference joints
    const indexMCP = lm[5];
    const middleMCP = lm[9];
    const ringMCP = lm[13];
    const pinkyMCP = lm[17];
    const thumbIP = lm[3];

    // Basic "up" tests (relative to MCP)
    const indexUp = indexTip.y < indexMCP.y - 0.03;
    const middleUp = middleTip.y < middleMCP.y - 0.03;
    const ringUp = ringTip.y < ringMCP.y - 0.03;
    const pinkyUp = pinkyTip.y < pinkyMCP.y - 0.03;

    const allOpen = indexUp && middleUp && ringUp && pinkyUp;

    // curls using tip-to-MCP distance (smaller -> curled)
    const indexCurl = dist(indexTip, indexMCP);
    const midCurl = dist(middleTip, middleMCP);
    const ringCurl = dist(ringTip, ringMCP);
    const pinkyCurl = dist(pinkyTip, pinkyMCP);

    // thumb forward (z smaller than wrist by threshold)
    const thumbForward = thumbTip.z < wrist.z - 0.05;

    // thumb-index pinch distance
    const thumbIndexDist = dist(indexTip, thumbTip);

    // spread measure (x distance between index and pinky)
    const spread = Math.abs(indexTip.x - pinkyTip.x);

    // wrist orientation approx (x difference indexTip - wrist)
    const wristTiltRight = wrist.x < indexTip.x - 0.05; // pointing right
    const wristTiltLeft = wrist.x > indexTip.x + 0.05;  // pointing left

    // ----------------- Specific gestures rules -----------------

    // HELLO: open palm (fingers open & spread reasonably)
    if (allOpen && spread > 0.07) return "HELLO";

    // STOP: open palm but fingers close together (vertical plane) -> palm front
    if (allOpen && spread <= 0.07) return "STOP";

    // YES: fist detection -> tips close to MCP (small distances)
    if (indexCurl < 0.035 && midCurl < 0.035 && ringCurl < 0.035 && pinkyCurl < 0.035)
      return "YES";

    // NO / ONE: index up only (strict) -> index extended and others curled
    if (indexUp && !middleUp && !ringUp && !pinkyUp) {
      // if thumb is also up, it's maybe OK or ILOVEYOU — defer
      if (thumbIndexDist > 0.06) return "NO"; // prefer NO
    }

    if (indexUp && !middleUp && !ringUp && !pinkyUp) return "NO";
    if (indexUp && midCurl < 0.04 && ringCurl < 0.04 && pinkyCurl < 0.04)
      return "ONE";

    // ONE (stricter)
    if (
      indexUp &&
      midCurl < 0.04 &&
      ringCurl < 0.04 &&
      pinkyCurl < 0.04 &&
      thumbIndexDist > 0.06
    )
      return "ONE";

    // PEACE / VICTORY: index + middle up, ring+pinky curled
    if (indexUp && middleUp && !ringUp && !pinkyUp) return "PEACE";

    // OK: thumb and index touching (pinch), other fingers up or relaxed
    if (thumbIndexDist < 0.03 && middleUp && ringUp && pinkyUp) return "OK";

    // PINCH: thumb + index close, but middle/ring more curled (select gesture)
    if (thumbIndexDist < 0.02 && midCurl < 0.04 && ringCurl < 0.04)
      return "PINCH";

    // I LOVE YOU (ASL): thumb + index + pinky up, middle&ring curled
    if (thumbIndexDist > 0.05 && indexUp && pinkyUp && !middleUp && !ringUp)
      return "ILOVEYOU";

    // POINTRIGHT / POINTLEFT: index extended and wrist tilt indicates direction
    if (indexUp && !middleUp && !ringUp && !pinkyUp) {
      if (wristTiltRight) return "POINTRIGHT";
      if (wristTiltLeft) return "POINTLEFT";
    }

    // THANKYOU: thumb forward (toward camera) relative to wrist
    if (thumbForward && indexUp) return "THANKYOU";

    // START / GO: (handled with motion later via FIST)
    if (indexCurl < 0.035 && midCurl < 0.035 && ringCurl < 0.035 && pinkyCurl < 0.035)
      return "FIST";

    // No match
    return null;
  }

  // handle results + buffer stabilization + motion detection (wave/start)
  const onResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw camera frame
    if (results.image) {
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    }

    // if no hand, reset buffers
    if (!results.multiHandLandmarks?.length) {
      stateRef.current.frameBuffer = [];
      stateRef.current.wristXBuffer = [];
      stateRef.current.wristZBuffer = [];
      stateRef.current.lastHandPresent = false;
      return;
    }

    const lm = results.multiHandLandmarks[0];

    // draw landmarks
    ctx.fillStyle = "cyan";
    lm.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x * 640, p.y * 480, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // candidate label from geometric classifier
    let candidate = classify(lm);

    // update wrist motion buffers for wave & start detection
    const wrist = lm[0];
    const wxBuf = stateRef.current.wristXBuffer;
    const wzBuf = stateRef.current.wristZBuffer;
    wxBuf.push(wrist.x);
    wzBuf.push(wrist.z);
    if (wxBuf.length > BUFSIZE) wxBuf.shift();
    if (wzBuf.length > BUFSIZE) wzBuf.shift();

    // detect wave: significant oscillation in wrist.x and open palm
    const meanX = wxBuf.reduce((a, b) => a + b, 0) / wxBuf.length || 0;
    const varX =
      wxBuf.reduce((a, b) => a + (b - meanX) ** 2, 0) / (wxBuf.length || 1);
    const wristOscillating = varX > WAVE_VARIANCE_THRESHOLD;

    // detect forward motion for START: large negative delta in wrist.z
    const zDelta =
      wzBuf.length >= 2 ? wzBuf[0] - wzBuf[wzBuf.length - 1] : 0;
    const forwardMotion = zDelta > START_FORWARD_THRESHOLD;

    // upgrade FIST + forwardMotion -> START
    if (candidate === "FIST" && forwardMotion) candidate = "START";

    // separate wave detection override: if oscillating + open palm -> WAVE
    const indexTip = lm[8],
      middleTip = lm[12],
      ringTip = lm[16],
      pinkyTip = lm[20];
    const indexMCP = lm[5],
      middleMCP = lm[9],
      ringMCP = lm[13],
      pinkyMCP = lm[17];
    const indexUp = indexTip.y < indexMCP.y - 0.03;
    const middleUp = middleTip.y < middleMCP.y - 0.03;
    const ringUp = ringTip.y < ringMCP.y - 0.03;
    const pinkyUp = pinkyTip.y < pinkyMCP.y - 0.03;
    const allOpen = indexUp && middleUp && ringUp && pinkyUp;

    if (allOpen && wristOscillating) candidate = "WAVE";

    // add candidate to frame buffer for stabilization
    const buf = stateRef.current.frameBuffer;
    buf.push(candidate || "NONE");
    if (buf.length > BUFSIZE) buf.shift();

    // determine most frequent non-NONE
    const freq = {};
    buf.forEach((v) => {
      if (v) freq[v] = (freq[v] || 0) + 1;
    });
    const entries = Object.entries(freq).filter(
      ([k]) => k && k !== "NONE"
    );
    if (entries.length === 0) return;

    entries.sort((a, b) => b[1] - a[1]);
    const [topLabel, topCount] = entries[0];

    // stable check
    if (topCount < STABLE_THRESHOLD) return;

    // cooldown + repeat avoidance
    if (stateRef.current.cooldown) return;
    if (stateRef.current.lastAccepted === topLabel) return;

    // accept the gesture
    stateRef.current.lastAccepted = topLabel;
    stateRef.current.cooldown = true;

    // update local display label
    setLastLabel(topLabel);

    // send to parent
    if (onRecognized && typeof onRecognized === "function") {
      onRecognized(topLabel);
    }

    // cooldown release
    setTimeout(() => {
      stateRef.current.cooldown = false;
    }, COOLDOWN_MS);

    // reset buffer
    stateRef.current.frameBuffer = [];
  };

  useEffect(() => {
    const Hands = window.MP?.Hands;
    const Camera = window.MP?.Camera;

    if (!Hands || !Camera) {
      console.error("Mediapipe not loaded (window.MP missing). Check index.html");
      return;
    }

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      smoothLandmarks: true,
      minDetectionConfidence: 0.55,
      minTrackingConfidence: 0.55,
    });

    hands.onResults(onResults);

    const startCam = () => {
      if (!webcamRef.current || !webcamRef.current.video) return;

      cameraRef.current = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          try {
            await hands.send({ image: webcamRef.current.video });
          } catch (e) {
            /* ignore frame send errors */
          }
        },
        width: 640,
        height: 480,
      });

      cameraRef.current.start();
    };

    const timeout = setTimeout(startCam, 700);

    return () => {
      clearTimeout(timeout);
      if (cameraRef.current) {
        try {
          cameraRef.current.stop();
        } catch (e) {
          /* ignore */
        }
      }
    };
  }, []);

  // ---------- UI: side-by-side camera + processed view ----------
  return (
    <div
      style={{
        border: "1px solid #333",
        padding: 10,
        background: "#111",
        borderRadius: 10,
      }}
    >
      <p style={{ color: "white", margin: 4 }}>Sign Recognition</p>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "stretch",
          flexWrap: "wrap",
        }}
      >
        {/* Left: plain camera */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <p
            style={{
              color: "#9ca3af",
              fontSize: 12,
              margin: "0 0 4px 2px",
            }}
          >
            Camera view
          </p>
          <Webcam
            ref={webcamRef}
            mirrored
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        </div>

        {/* Right: processed canvas with points */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <p
            style={{
              color: "#9ca3af",
              fontSize: 12,
              margin: "0 0 4px 2px",
            }}
          >
            Analysis view
          </p>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
            }}
          />
        </div>
      </div>

      {lastLabel && (
        <p
          style={{
            color: "#9ca3af",
            marginTop: 6,
            fontSize: 12,
          }}
        >
          Last recognised sign: <strong>{lastLabel}</strong>
        </p>
      )}
    </div>
  );
}