import { useUser } from "../context/Auth.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";

const Profile = () => {
  const { user, logOut } = useUser();
  const navigate = useNavigate();
  const [githubRepos, setGithubRepos] = useState([]);

  useEffect(() => {
    if (user?.githubUsername) {
      fetch(`https://api.github.com/users/${user.githubUsername}/repos`)
        .then((res) => res.json())
        .then((data) => setGithubRepos(data))
        .catch((err) => console.error("Error fetching GitHub repos:", err));
    }
  }, [user?.githubUsername]);

  const handleLogOut = () => {
    logOut();
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user?.profilePicture || "/default-avatar.png"} alt="Profile" className="profile-pic" />
        <h2>{user?.name || "Your Name"}</h2>
        <p>{user?.headline || "Your Professional Headline"}</p>
        <p>{user?.bio || "No bio available"}</p>
        <p>GitHub: <a href={`https://github.com/${user?.githubUsername}`} target="_blank" rel="noopener noreferrer">{user?.githubUsername}</a></p>
      </div>

      <div className="profile-section">
        <h3>Experience & Skills</h3>
        <p>{user?.experience || "No experience listed"}</p>
        <p>{user?.skills || "No skills listed"}</p>
      </div>

      <div className="profile-section">
        <h3>GitHub Repositories</h3>
        {githubRepos.length > 0 ? (
          <ul>
            {githubRepos.map((repo) => (
              <li key={repo.id}>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No repositories linked</p>
        )}
      </div>
      <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default Profile;