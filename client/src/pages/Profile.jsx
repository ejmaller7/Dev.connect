import { useUser } from "../context/Auth.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import "../css/Profile.css";
import BlankProfilePic from '../../assets/images/BlankProfilePicture.webp';

const Profile = () => {
  const { user, logOut } = useUser();
  const [connections, setConnections] = useState([]);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    navigate("/login");
  };

  useEffect(() => {
    if (!user || !user._id) return;

    const showConnections = import.meta.env.VITE_APP_ENV === 'production' 
      ? `https://dev-connect-invw.onrender.com/api/user/${user._id}/connections`
      : `http://localhost:5000/api/user/${user._id}/connections`;

    fetch(showConnections)
      .then(res => res.json())
      .then(data => {
        setConnections(data);
      })
      .catch(err => console.error("Error fetching connections:", err));
  }, [user]);

  return (
<div className="profile-container">
      <div className="profile-header">
        <img src={user?.profilePicture || `${BlankProfilePic}`} alt="Profile" className="profile-pic" />
        <h2>{user?.name || "Your Name"}</h2>
        <h4>{user?.headline || "Your Professional Headline"}</h4>
        <p className="profile-bio">{user?.bio || "No bio available"}</p>
        <p>GitHub: <a href={`https://github.com/${user?.githubUsername}`} target="_blank" rel="noopener noreferrer">{user?.githubUsername}</a></p>
      </div>

      {/* Display users connections */}
      <h2>Connections</h2>
      {connections.length > 0 ? (
        <div className="connections-list">
          {connections.map((conn) => (
            <div key={conn._id} className="connection-card">
              <img src={conn.profilePicture || `${BlankProfilePic}`} alt={conn.name} />
              <h3>{conn.name}</h3>
              <p>{conn.headline || "No headline available"}</p>
            </div>
          ))}
        </div>
      ) : <p>No connections yet</p>}


      <div className="profile-section">
        <h3>Experience</h3>
        <p>{user?.experience || "No experience listed"}</p>
      </div>

      <div className="profile-section">
        <h3>Skills</h3>
        <p>{user?.skills || "No skills listed"}</p>
      </div>

      {/* Selected GitHub Repositories Section */}
      <div className="profile-section">
        <h3>Development Portfolio</h3>
        <div className="repo-grid">
          {user?.selectedRepositories?.length > 0 ? (
            user.selectedRepositories.map((repo) => (
              <div key={repo.repoName} className="repo-card">
                <img src={repo.image} alt={repo.repoName} className="repo-image" />
                <div className="repo-content">
                  <h4><a href={repo.repoUrl} target="_blank" rel="noopener noreferrer">{repo.repoName}</a></h4>
                  <p>{repo.description}</p>
                  <span className="repo-language">{repo.language}</span>
                  {repo.deployedUrl && (
                    <p>
                      <a href={repo.deployedUrl} target="_blank" rel="noopener noreferrer">Deployed App</a>
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No repositories selected.</p>
          )}
        </div>
      </div>

      <button className="button-edit" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
      <button className="button-logout" onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default Profile;