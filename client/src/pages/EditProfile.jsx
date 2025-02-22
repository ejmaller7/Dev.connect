import { useState } from "react";
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

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const editProfileURL = import.meta.env.VITE_APP_ENV === 'production' 
            ? 'https://dev-connect-invw.onrender.com/api/update-profile' 
            : 'http://localhost:5000/api/update-profile';

    try {
      const response = await fetch(editProfileURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ userId: user._id, ...formData }),
      });

      const data = await response.json();
      console.log("Server Response:", data); // Debugging

      if (!response.ok) {
        setMessage(data.message || "Error updating profile.");
        return;
      }
        
      if (data.user && data.user.username) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user)); // Update localStorage
        setMessage("Profile updated successfully!");
        
        setTimeout(() => navigate("/profile"), 1500);
      } else {
      setMessage("Error: Missing username in response.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Something went wrong, please try again.");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="text" name="headline" value={formData.headline} onChange={handleChange} placeholder="Headline" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio"></textarea>
        <input type="text" name="githubUsername" value={formData.githubUsername} onChange={handleChange} placeholder="GitHub Username" />
        <textarea name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience"></textarea>
        <textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills"></textarea>
        
        {message && <p className="message">{message}</p>}
        
        <button type="submit">Save Changes</button>
        <button type="button" className="cancel-btn" onClick={() => navigate("/profile")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProfile;
