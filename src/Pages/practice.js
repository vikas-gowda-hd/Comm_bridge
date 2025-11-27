import React, { useState } from "react";
import "../App.css";
import CameraSignRecognizer from "../CameraSignRecognizer";

// Signs that the current classifier can output
const VALID_SIGNS = [
  "HELLO",
  "YES",
  "NO",
  "THANKYOU",
  "STOP",
  "WAVE",
  "START",
  "PEACE",
  "OK",
  "PINCH",
  "ILOVEYOU",
  "POINTRIGHT",
  "POINTLEFT",
];

function Practice() {
  const [lastSeen, setLastSeen] = useState(null);
  const [status, setStatus] = useState(
    "Show any hand sign towards the camera. If it matches a known sign, you'll earn points."
  );

  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);

  const accuracy = attempts === 0 ? 0 : Math.round((correct / attempts) * 100);

  const handleRecognized = (label) => {
    if (!label) return;

    const upper = label.toUpperCase();
    setLastSeen(upper);
    setAttempts((prev) => prev + 1);

    const isValidSign = VALID_SIGNS.includes(upper);

    if (isValidSign) {
      setCorrect((prev) => prev + 1);
      setScore((prev) => prev + 10);
      setStatus(`Correct — "${upper}" is recognised as a valid sign.`);
    } else {
      setScore((prev) => Math.max(0, prev - 2));
      setStatus(
        `The movement recognised as "${upper}" doesn't look like a proper sign for a word or letter. Try a clearer gesture.`
      );
    }
  };

  return (
    <div className="container mt-4 practice-page">
      <h2 className="heading hero-heading-glow">Practice Lab</h2>
      <p className="normal-text" style={{ marginTop: 10, marginBottom: 20 }}>
        Just sign freely. If what you do looks like a real, defined sign, you
        gain points. Random or messy motions will count as incorrect.
      </p>

      <div className="row g-4">
        {/* LEFT SIDE – status + scoreboard */}
        <div className="col-md-4">
          <div className="practice-card">
            <div className="practice-card-header">
              <span className="practice-pill">Live feedback</span>
              <span className="practice-dot" />
            </div>

            <div className="practice-status-box" style={{ marginTop: 18 }}>
              <div className="practice-status-label">Status</div>
              <div className="practice-status-value">{status}</div>

              <div className="practice-status-hint" style={{ marginTop: 8 }}>
                {lastSeen ? (
                  <>
                    Last recognised: <strong>{lastSeen}</strong>
                  </>
                ) : (
                  "Hold your dominant hand clearly inside the camera frame."
                )}
              </div>
            </div>

            <div className="practice-status-box" style={{ marginTop: 18 }}>
              <div className="practice-status-label">Scoreboard</div>
              <div className="practice-score-row">
                <div>
                  <div className="practice-score-label">Score</div>
                  <div className="practice-score-value">{score}</div>
                </div>
                <div>
                  <div className="practice-score-label">Correct</div>
                  <div className="practice-score-value">{correct}</div>
                </div>
                <div>
                  <div className="practice-score-label">Attempts</div>
                  <div className="practice-score-value">{attempts}</div>
                </div>
                <div>
                  <div className="practice-score-label">Accuracy</div>
                  <div className="practice-score-value">{accuracy}%</div>
                </div>
              </div>

              <div className="practice-score-bar">
                <div
                  className="practice-score-bar-fill"
                  style={{ width: `${accuracy}%` }}
                />
              </div>

              <div
                className="practice-status-hint"
                style={{ marginTop: 8, fontSize: 12 }}
              >
                Clear, repeatable signs → higher score. Treat this like a mini-game.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – camera area */}
        <div className="col-md-8">
          <div className="practice-camera-shell">
            <div className="practice-camera-orb orbit-1" />
            <div className="practice-camera-orb orbit-2" />

            <div className="practice-camera-header">
              <span className="practice-badge">
                Live Camera · Free practice
              </span>
              <span className="practice-gesture-tag">
                Just sign – I’ll tell you if it looks like a valid sign.
              </span>
            </div>

            <div className="practice-camera-frame">
              <CameraSignRecognizer onRecognized={handleRecognized} />
            </div>

            <div className="practice-footer-strip">
              <span className="practice-footer-dot" />
              Correct signs give +10 points. Unclear gestures reduce your score slightly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Practice;
