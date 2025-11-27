import React from "react";

function Masthead() {
  return (
    <div className="hero-animated">

      {/* Floating Orbs */}
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      {/* Main Content Overlay */}
      <div className="container-fluid d-flex justify-content-center align-items-center hero-overlay">
        <div
          className="row d-flex justify-content-center align-items-center"
          style={{ flexDirection: "column" }}
        >

          {/* Heading */}
          <div className="col-lg-7 text-white font-weight-bold display-1 text-center fade-up delay-0 hero-heading-glow">
            Welcome to Sensebridge nexus!
          </div>

          {/* Divider */}
          <div className="col-lg-4 divider my-4 fade-up delay-1"></div>

          {/* Description */}
          <div
            className="col-lg-7 container text-white-50 lead text-center fade-up delay-2"
            style={{ fontSize: "1.5rem" }}
          >
            The complete toolkit for Indian Sign Language. Explore our range of
            features which have been carefully designed keeping in mind the
            specific needs of people related to ISL.
          </div>

          {/* Button */}
          <div className="d-flex justify-content-center mt-5 fade-up delay-3">
            <a className="btn btn-info btn-lg px-3" href="#intro">
              Get Started <i className="fa fa-angle-down" />
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Masthead;
