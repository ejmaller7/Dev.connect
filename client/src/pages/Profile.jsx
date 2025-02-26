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
        .then((data) => {
          const formattedRepos = data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            url: repo.html_url,
            description: repo.description || "No description available",
            language: repo.language || "Unknown",
            image: `https://opengraph.githubassets.com/1/${user.githubUsername}/${repo.name}`,
          }));
          setGithubRepos(formattedRepos);
        })
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
        <h4>{user?.headline || "Your Professional Headline"}</h4>
        <p className="profile-bio">{user?.bio || "No bio available"}</p>
        <p>GitHub: <a href={`https://github.com/${user?.githubUsername}`} target="_blank" rel="noopener noreferrer">{user?.githubUsername}</a></p>
      </div>

      <div className="profile-section">
        <h3>Experience & Skills</h3>
        <p>{user?.experience || "No experience listed"}</p>
        <p>{user?.skills || "No skills listed"}</p>
      </div>

      <div className="profile-section">
        <h3>GitHub Repositories</h3>
        <div className="repo-grid">
          {githubRepos.length > 0 ? (
            githubRepos.map((repo) => (
            <div key={repo.id} className="repo-card">
              <img src={repo.image} alt={repo.name} className="repo-image" />
              <div className="repo-content">
                <h4><a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}</a></h4>
                <p>{repo.description}</p>
                <span className="repo-language">{repo.language}</span>
              </div>
            </div>
              ))
            ) : (
          <p>No repositories linked</p>
        )}
        </div>
      </div>
      <button className="button-edit" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
      <button className="button-logout"onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default Profile;