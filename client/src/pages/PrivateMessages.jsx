import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/Auth";
import '../css/PrivateMessages.css';
import defaultProfile from "../../assets/images/BlankProfilePicture.webp"

const API_BASE_URL = import.meta.env.VITE_APP_ENV === "production"
    ? "https://dev-connect-invw.onrender.com"
    : "http://localhost:5000";

const PrivateMessages = () => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/all-users`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

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
        } else {
          console.error("Error fetching users with messages:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users with messages:", error.message);
      }
    };

    fetchUsers();
    fetchUsersWithMessages();
  }, [isAuthenticated]);

  const handleUserClick = (userId) => {
    navigate(`/messages/${userId}`);
    setShowDropdown(false); 
  };

  return (
    <div className="private-messages-container">
      <h2>Private Messages</h2>
      {isAuthenticated && (
        <>

          <div className="users-dropdown">
            <button className="start-message-btn" onClick={() => setShowDropdown(!showDropdown)}>
              Start a New Message
            </button>

            {showDropdown && (
              <div className={`users-list-dropdown ${showDropdown ? 'open' : ''}`}>
                {users.length === 0 ? (
                  <p>No users available.</p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="user-item"
                      onClick={() => handleUserClick(user._id)}
                    >
                      <img
                        src={user.profilePicture && user.profilePicture.trim() !== "" ? user.profilePicture : defaultProfile}
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

          <div className="users-list-messages">
            <h3>Recent Conversations</h3>
            {usersWithMessages.length === 0 ? (
              <p>No recent conversations.</p>
            ) : (
              usersWithMessages.map((user) => (
                <div
                  key={user._id}
                  className="user-item"
                  onClick={() => handleUserClick(user._id)}
                >
                  <img
                    src={user.profilePicture && user.profilePicture.trim() !== "" ? user.profilePicture : defaultProfile}
                    alt="Profile"
                    className="profile-picture"
                  />
                  <span>{user.username}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PrivateMessages;





