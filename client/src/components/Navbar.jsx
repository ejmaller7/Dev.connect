import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../context/Auth.jsx';
import Logo from '../../assets/images/devconnect.jpg';
import Searchbar from './Searchbar';
import '../css/Navbar.css';

const NavBar = () => {
  const { user, isAuthenticated, logOut } = useUser();  
  const navigate = useNavigate();
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  
  const handleLogOut = () => {
    logOut();
    navigate('/welcome');
  };

  // Only render Navbar if the user is authenticated
  if (!isAuthenticated) return null;

  return (
    <header className="header">
      <div className="header__logo-title">
        <img src={Logo} alt="NullLabsLogo" className="header__logo" />
      </div>
      <nav className="header__nav">
        <ul className="header__menu">
          <li>
            <Link to="/" className="header__link">Home</Link>
          </li>
          <li>
            <Link to="/messages" className="header__link">Messages</Link>
          </li>
          <li>
            <Link to="/network" className="header__link">Network</Link>
          </li>
          <li>
            <Link to="/news" className="header__link">News</Link>
          </li>
          <li>
            <Link to="/jobs" className="header__link">Jobs</Link>
          </li>
          <li
            className="category-dropdown"
            onMouseEnter={() => setIsCategoryHovered(true)}
            onMouseLeave={() => setIsCategoryHovered(false)}
          >
            <Link to="/category" className="header__link">Category</Link>
            {isCategoryHovered && (
              <ul className="category-dropdown-menu">
                {/* Add your category dropdown items here */}
              </ul>
            )}
          </li>
          <li
            className="profile-dropdown-container"
            onMouseEnter={() => setIsProfileHovered(true)}
            onMouseLeave={() => setIsProfileHovered(false)}
          >
            <Link to="/profile" className="header__link">Profile</Link>
            {isProfileHovered && (
              <ul className="profile-dropdown">
                {user ? (
                  <>
                    <li>
                      <button onClick={() => navigate('/profile')}>My Profile</button>
                    </li>
                    <li>
                      <button onClick={handleLogOut}>Log Out</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button onClick={() => navigate('/login')}>Login</button>
                    </li>
                    <li>
                      <button onClick={() => navigate('/register')}>Register</button>
                    </li>
                  </>
                )}
              </ul>
            )}
          </li>
        </ul>
      </nav>
      {user ? (
        <div className="welcome-message">Welcome, {user?.username || "User"}!</div>
      ) : (
        <div className="welcome-message">Not logged in, please login first</div>
      )}
      <div>
        <Searchbar onSearch={(term) => console.log("Search term:", term)} />
      </div>
    </header>
  );
};

export default NavBar;
