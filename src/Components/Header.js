import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/header.css";

const Header = ({ openBooking }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-title">Salon</div>
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <span
            onClick={() => {
              openBooking();
              closeMenu();
            }}
            className="book-now-link nav-link"
          >
            Book Now
          </span>
          <NavLink
            to="/location"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMenu}
          >
            Locations
          </NavLink>
        </nav>
      </header>
    </>
  );
};

export default Header;
