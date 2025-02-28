import { useUser } from "../context/Auth.jsx";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";

const Profile = () => {
  const { user, logOut } = useUser();
  const navigate = useNavigate();

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