import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/Auth";

const API_BASE_URL = import.meta.env.VITE_APP_ENV === "production"
    ? "https://dev-connect-invw.onrender.com"
    : "http://localhost:5000";

const PrivateMessages = () => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [usersWithMessages, setUsersWithMessages] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUsersWithMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/private-messages/users`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsersWithMessages(data);
          console.log("Fetched users with messages:", data);
        } else {
          console.error("Error fetching users with messages:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users with messages:", error.message, error.stack);
      }
    };

    fetchUsersWithMessages();
  }, [isAuthenticated]);

  const handleUserClick = (userId) => {
    navigate(`/messages/${userId}`); 
  };

  return (
    <div className="private-messages-container">
      <h2>Private Messages</h2>
      {isAuthenticated && (
        <div className="users-list">
          {usersWithMessages.length === 0 ? (
            <p>No users to show.</p>
          ) : (
            usersWithMessages.map((user) => (
              <div
                key={user._id}
                className="user-item"
                onClick={() => handleUserClick(user._id)} 
              >
                <img
                  src={user.profilePicture || "default-profile.png"}
                  alt="Profile"
                  className="profile-picture"
                />
                <span>{user.username}</span> 
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PrivateMessages;


