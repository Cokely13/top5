// Navbar.js
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { logout } from '../store';

const Navbar = ({ handleClick, isLoggedIn, isAdmin }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isRulesModalOpen, setRulesModalOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [location]);

  const openRulesModal = () => {
    setRulesModalOpen(true);
    closeMobileMenu(); // Close mobile menu if open
  };

  const closeRulesModal = () => {
    setRulesModalOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo or Brand Name */}
        {isLoggedIn && (
          <Link to="/home" className="navbar-logo" onClick={closeMobileMenu}>
            <img src="/logo.png" alt="Logo" className="navbar-logo-image" />
          </Link>
        )}

        {/* Hamburger Menu Icon */}
        <div className="menu-icon" onClick={toggleMobileMenu} aria-label="Menu">
          <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>

        {/* Navigation Links */}
        <nav className={isMobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          {isLoggedIn ? (
            <ul className="nav-links">
              {/* Home Link */}
              <li className="nav-item">
                <NavLink to="/home" onClick={closeMobileMenu} className="nav-link">
                  Home
                </NavLink>
              </li>

              {/* Personal Dropdown */}
              <li
                className={`nav-item dropdown ${
                  activeDropdown === 'personal' ? 'active' : ''
                }`}
              >
                <span
                  className="nav-link"
                  onClick={() => toggleDropdown('personal')}
                >
                  Personal <i className="fas fa-caret-down"></i>
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/profile" onClick={closeMobileMenu}>
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/users" onClick={closeMobileMenu}>
                      Users
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* Boards Dropdown */}
              <li
                className={`nav-item dropdown ${
                  activeDropdown === 'boards' ? 'active' : ''
                }`}
              >
                <span
                  className="nav-link"
                  onClick={() => toggleDropdown('boards')}
                >
                  Boards <i className="fas fa-caret-down"></i>
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/leaderboard" onClick={closeMobileMenu}>
                      Daily Leaderboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/career" onClick={closeMobileMenu}>
                      Career Leaderboard
                    </NavLink>
                  </li>
                </ul>
              </li>

                {/* Rules Link */}
                <li className="nav-item">
                <span className="nav-link rules-link" onClick={openRulesModal}>
                  Rules <i className="fas fa-info-circle"></i>
                </span>
              </li>

              {/* Logout */}
              <li className="nav-item">
                <a href="#" onClick={handleClick} className="nav-link logout">
                  Logout
                </a>
              </li>
            </ul>
          ) : (
            <ul className="nav-links">
              {/* Login and Sign Up Links */}
              <li className="nav-item">
                <NavLink to="/login" onClick={closeMobileMenu} className="nav-link">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/signup" onClick={closeMobileMenu} className="nav-link">
                  Sign Up
                </NavLink>
              </li>
            </ul>
          )}
        </nav>
      </div>

      {/* Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="menu-overlay" onClick={closeMobileMenu}></div>
      )}

       {/* Rules Modal */}
       {isRulesModalOpen && (
        <div className="modal-overlay" onClick={closeRulesModal}>
          <div className="modalrules-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeRulesModal}>&times;</span>
            <h2>Rules</h2>
            <p>
              The top 10 answers are listed. Get points for every top 5 answer and a strike for every answer not in the top 10. 3 strikes and you're OUT!
            </p>
          </div>
        </div>
      )}
    </header>
  );
};




const mapState = (state) => ({
  isLoggedIn: !!state.auth.id,
  isAdmin: state.auth.admin,
});

const mapDispatch = (dispatch) => ({
  handleClick() {
    dispatch(logout());
  },
});

export default connect(mapState, mapDispatch)(Navbar);
