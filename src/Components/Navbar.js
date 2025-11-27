import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../Assets/logo.png';

function Navbar() {
  return (
    <nav
      className="navbar navbar-dark bg-dark navbar-expand-lg fixed-top py-3"
      id="mainNav"
    >
      <div className="container px-4 px-lg-5">
        {/* Brand */}
        <Link to="/sensebridge-nexus/home" className="navbar-brand mb-0 h1">
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top me-3"
            alt="Logo"
          />
          Sensebridge Nexus
        </Link>

        {/* Toggler (mobile) */}
        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto my-2 my-lg-0">

            <li className="nav-item">
              <NavLink
                to="/sensebridge-nexus/home"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/sensebridge-nexus/convert"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Convert
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/sensebridge-nexus/learn-sign"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Learn Sign
              </NavLink>
            </li>

            {/* we’re not removing Videos route yet, just hiding it from main nav for now */}
            {/* <li className="nav-item">
              <NavLink
                to="/sensebridge-nexus/all-videos"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Videos
              </NavLink>
            </li> */}

            <li className="nav-item">
              <NavLink
                to="/sensebridge-nexus/practice"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Practice
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/sensebridge-nexus/dictionary"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Dictionary
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/sensebridge-nexus/about"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                About
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
