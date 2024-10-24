// // Navbar.js
// import React, { useState } from 'react';
// import { connect } from 'react-redux';
// import { Link, NavLink } from 'react-router-dom';
// import { logout } from '../store';

// const Navbar = ({ handleClick, isLoggedIn, isAdmin }) => {
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!isMobileMenuOpen);
//     setActiveDropdown(null);
//   };

//   const closeMobileMenu = () => {
//     setMobileMenuOpen(false);
//     setActiveDropdown(null);
//   };

//   const toggleDropdown = (dropdownName) => {
//     if (activeDropdown === dropdownName) {
//       setActiveDropdown(null);
//     } else {
//       setActiveDropdown(dropdownName);
//     }
//   };

//   return (
//     <header className="navbar">
//       <div className="navbar-container">
//         {/* Logo or Brand Name */}
//         {isLoggedIn && (
//           <Link to="/home" className="navbar-logo" onClick={closeMobileMenu}>
//             <img src="/logo.png" alt="Logo" className="navbar-logo-image" />
//           </Link>
//         )}

//         {/* Hamburger Menu Icon */}
//         <div className="menu-icon" onClick={toggleMobileMenu} aria-label="Menu">
//           <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
//         </div>

//         {/* Navigation Links */}
//         <nav className={isMobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
//           {isLoggedIn ? (
//             <ul className="nav-links">
//               {/* Home Link */}
//               <li className="nav-item">
//                 <NavLink to="/home" onClick={closeMobileMenu} className="nav-link">
//                   Home
//                 </NavLink>
//               </li>

//               {/* Personal Dropdown */}
//               <li
//                 className={`nav-item dropdown ${
//                   activeDropdown === 'personal' ? 'active' : ''
//                 }`}
//                 onMouseEnter={() => {
//                   if (window.innerWidth > 768) {
//                     setActiveDropdown('personal');
//                   }
//                 }}
//                 onMouseLeave={() => {
//                   if (window.innerWidth > 768) {
//                     setActiveDropdown(null);
//                   }
//                 }}
//               >
//                 <span
//                   className="nav-link"
//                   onClick={() => {
//                     if (window.innerWidth <= 768) {
//                       toggleDropdown('personal');
//                     }
//                   }}
//                 >
//                   Personal <i className="fas fa-caret-down"></i>
//                 </span>
//                 <ul className="dropdown-menu">
//                   <ul>
//                     <NavLink to="/profile" onClick={closeMobileMenu}>
//                       Profile
//                     </NavLink>
//                   </ul>
//                   <ul>
//                     <NavLink to="/users" onClick={closeMobileMenu}>
//                       Users
//                     </NavLink>
//                   </ul>
//                 </ul>
//               </li>

//               {/* Boards Dropdown */}
//               <li
//                 className={`nav-item dropdown ${
//                   activeDropdown === 'boards' ? 'active' : ''
//                 }`}
//                 onMouseEnter={() => {
//                   if (window.innerWidth > 768) {
//                     setActiveDropdown('boards');
//                   }
//                 }}
//                 onMouseLeave={() => {
//                   if (window.innerWidth > 768) {
//                     setActiveDropdown(null);
//                   }
//                 }}
//               >
//                 <span
//                   className="nav-link"
//                   onClick={() => {
//                     if (window.innerWidth <= 768) {
//                       toggleDropdown('boards');
//                     }
//                   }}
//                 >
//                   Boards <i className="fas fa-caret-down"></i>
//                 </span>
//                 <ul className="dropdown-menu">
//                   <ul>
//                     <NavLink to="/leaderboard" onClick={closeMobileMenu}>
//                       Daily Leaderboard
//                     </NavLink>
//                   </ul>
//                   <ul>
//                     <NavLink to="/career" onClick={closeMobileMenu}>
//                       Career Leaderboard
//                     </NavLink>
//                   </ul>
//                 </ul>
//               </li>

//               {/* Logout */}
//               <li className="nav-item">
//                 <a href="#" onClick={handleClick} className="nav-link logout">
//                   Logout
//                 </a>
//               </li>
//             </ul>
//           ) : (
//             <ul className="nav-links">
//               {/* Login and Sign Up Links */}
//               <li className="nav-item">
//                 <NavLink to="/login" onClick={closeMobileMenu} className="nav-link">
//                   Login
//                 </NavLink>
//               </li>
//               <li className="nav-item">
//                 <NavLink to="/signup" onClick={closeMobileMenu} className="nav-link">
//                   Sign Up
//                 </NavLink>
//               </li>
//             </ul>
//           )}
//         </nav>
//       </div>

//       {/* Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div className="menu-overlay" onClick={closeMobileMenu}></div>
//       )}
//     </header>
//   );
// };

// const mapState = (state) => ({
//   isLoggedIn: !!state.auth.id,
//   isAdmin: state.auth.admin,
// });

// const mapDispatch = (dispatch) => ({
//   handleClick() {
//     dispatch(logout());
//   },
// });

// export default connect(mapState, mapDispatch)(Navbar);

// Navbar.js
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { logout } from '../store';

const Navbar = ({ handleClick, isLoggedIn, isAdmin }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
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
