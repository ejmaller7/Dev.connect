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

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

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

    const uploadProfilePicture = import.meta.env.VITE_APP_ENV === 'production' 
      ? 'https://dev-connect-invw.onrender.com/api/user/upload-profile-picture' 
      : 'http://localhost:5000/api/user/upload-profile-picture';

    const editProfileURL = import.meta.env.VITE_APP_ENV === 'production' 
            ? 'https://dev-connect-invw.onrender.com/api/user/update-profile' 
            : 'http://localhost:5000/api/user/update-profile';

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
            uploadedImageUrl = uploadData.profilePicture; // Update profile pic URL
        } else {
            setMessage("Image upload failed.");
            return;
        }
    }
    
    const formDataToSend = {
      userId: user._id,
      name: formData.name,
      headline: formData.headline,
      bio: formData.bio,
      githubUsername: formData.githubUsername,
      experience: formData.experience,
      skills: formData.skills,
    };

    const response = await fetch(editProfileURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(formDataToSend),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
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
        
        {message && <p className="message">{message}</p>}
        
        <button type="submit">Save Changes</button>
        <button type="button" className="cancel-btn" onClick={() => navigate("/profile")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProfile;
