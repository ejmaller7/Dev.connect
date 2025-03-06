import { useState, useEffect } from "react";
import { useUser } from "../context/Auth.jsx";
import { useNavigate } from "react-router-dom";
import "../css/EditProfile.css";

const EditProfile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    bio: user?.bio || "",
    githubUsername: user?.githubUsername || "",
    experience: user?.experience || "",
    skills: user?.skills || "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [githubRepos, setGithubRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState(user?.selectedRepositories || []);

  // Handles all functionality for selecting & deselecting repos
  useEffect(() => {
    if (!user || !user._id) return;

    const loadRepos = import.meta.env.VITE_APP_ENV === 'production' 
    ? `https://dev-connect-invw.onrender.com/api/user/${user.id}/repos` 
    : `http://localhost:5000/api/user/${user._id}/repos`;

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
            deployedUrl: "",
          }));
          setGithubRepos(formattedRepos);
        })
        .catch((err) => console.error("Error fetching GitHub repos:", err));
    }

    const fetchSelectedRepos = async () => {
      try {
        const response = await fetch(loadRepos);
        if (!response.ok) throw new Error("Failed to fetch selected repositories");

            const data = await response.json();
            console.log("Fetched selected repositories:", data.selectedRepositories);

            if (Array.isArray(data.selectedRepositories)) {
                setSelectedRepos(data.selectedRepositories); // Correctly update state
            } else {
                console.error("Invalid format received for repositories.");
            }
        } catch (error) {
            console.error("Error fetching selected repositories:", error);
        }
    };

    fetchSelectedRepos();

  }, [user?._id]);

  const handleRepoSelect = (repo) => {
    setSelectedRepos((prevRepos) => {
      const isAlreadySelected = prevRepos.some((r) => r.name === repo.name);
  
      if (isAlreadySelected) {
        return prevRepos.filter((r) => r.name !== repo.name);
      } else if (prevRepos.length < 8) {
        return [...prevRepos, repo];
      } else {
        setMessage("You can only select up to 8 repositories.");
        return prevRepos;
      }
    });
  };

  const handleDeployedLinkChange = (repoName, deployedUrl) => {
    setSelectedRepos(
      selectedRepos.map((repo) =>
        repo.name === repoName ? { ...repo, deployedUrl } : repo
      )
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Keep existing image if no new one is selected
    let uploadedImageUrl = user.profilePicture;

    const formDataToSend = {
      userId: user._id,
      name: formData.name,
      headline: formData.headline,
      bio: formData.bio,
      githubUsername: formData.githubUsername,
      experience: formData.experience,
      skills: formData.skills,
    };

    const uploadProfilePicture = import.meta.env.VITE_APP_ENV === 'production' 
      ? 'https://dev-connect-invw.onrender.com/api/user/upload-profile-picture' 
      : 'http://localhost:5000/api/user/upload-profile-picture';

    const editProfileURL = import.meta.env.VITE_APP_ENV === 'production' 
      ? 'https://dev-connect-invw.onrender.com/api/user/update-profile' 
      : 'http://localhost:5000/api/user/update-profile';
    
    const updateReposURL = import.meta.env.VITE_APP_ENV === 'production' 
      ? 'https://dev-connect-invw.onrender.com/api/user/update-repos' 
      : 'http://localhost:5000/api/user/update-repos';

    // Update profile picture
    try {
      if (image) {
        const imageData = new FormData();
        imageData.append("image", image);
        imageData.append("userId", user._id);

        const uploadResponse = await fetch(uploadProfilePicture, {
            method: "POST",
            body: imageData,
        });

        const uploadData = await uploadResponse.json();

        if (uploadResponse.ok) {
            uploadedImageUrl = uploadData.profilePicture;
        } else {
            setMessage("Image upload failed.");
            return;
        }
      }

      // Update repositories
      const repoResponse = await fetch(updateReposURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({
          userId: user._id,
          selectedRepositories: selectedRepos.map(repo => ({
              name: repo.name,
              url: repo.url,
              deployedURL: repo.deployedURL,
              description: repo.description,
              language: repo.language,
              image: repo.image,
          })),
        }),
      });

      if (!repoResponse.ok) {
        setMessage("Error updating repositories.");
        return;
      }

      const repoUpdateData = await repoResponse.json();
      console.log("Updated repositories:", repoUpdateData);

      // Update whole Profile
      const response = await fetch(editProfileURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ ...formDataToSend, profilePicture: uploadedImageUrl }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        
        setUser({ ...user, selectedRepositories: selectedRepos });
        localStorage.setItem("user", JSON.stringify({ ...user, selectedRepositories: selectedRepos }));
        setMessage('Profile updated successfully!');
        setTimeout(() => navigate('/profile'), 1500);

      } else {
        setMessage('Error updating profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage('Something went wrong, please try again.');
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form" encType="multipart/form-data">
        {/* Profile Picture Upload */}
        <input type="file" onChange={handleFileChange} />

        {/* Everything else in profile */}
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="text" name="headline" value={formData.headline} onChange={handleChange} placeholder="Headline" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio"></textarea>
        <input type="text" name="githubUsername" value={formData.githubUsername} onChange={handleChange} placeholder="GitHub Username" />
        <textarea name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience"></textarea>
        <textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills"></textarea>

        {/* GitHub Repo Selection */}
        <h3>Select up to 8 Repositories:</h3>
        <div className="repo-selection-grid">
          {githubRepos.map((repo) => {
            return (
              <div key={repo.id} className="repo-card">
                {/* Checkbox for selection */}
                <input
                  type="checkbox"
                  checked={selectedRepos.some((selectedRepo) => selectedRepo.name === repo.name)}
                  onChange={() => handleRepoSelect(repo)}
                  className="repo-checkbox"
                />

                <img src={repo.image} alt={repo.name} />
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>

                {/* Input for deployed link */}
                <input
                  type="url"
                  placeholder="Deployed link"
                  value={selectedRepos.find((r) => r.name === repo.name)?.deployedUrl || ""}
                  onChange={(e) => handleDeployedLinkChange(repo.name, e.target.value)}
                />
              </div>
            );
          })}
        </div>

        {message && <p className="message">{message}</p>}
        
        <button type="submit">Save Changes</button>
        <button type="button" className="cancel-btn" onClick={() => navigate("/profile")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProfile;
