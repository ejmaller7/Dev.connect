import { useState, useEffect } from "react";
import { useUser } from "../context/Auth.jsx";
import "../css/Network.css";
import BlankProfilePic from '../../assets/images/BlankProfilePicture.webp';

const Network = () => {
    const { user } = useUser() || {};
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendRequests, setFriendRequests] = useState([]);
    const [connections, setConnections] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);

    const getAllUsers = import.meta.env.VITE_APP_ENV === 'production' 
        ? 'https://dev-connect-invw.onrender.com/api/user/all-users' 
        : 'http://localhost:5000/api/user/all-users';

    const sendRequest = import.meta.env.VITE_APP_ENV === 'production' 
        ? 'https://dev-connect-invw.onrender.com/api/user/send-request' 
        : 'http://localhost:5000/api/user/send-request';

    const acceptRequest = import.meta.env.VITE_APP_ENV === 'production' 
        ? 'https://dev-connect-invw.onrender.com/api/user/accept-request' 
        : 'http://localhost:5000/api/user/accept-request';

    // Gets all the users
    useEffect(() => {
        if (!user || !user._id) return;

        const showFriendRequests = import.meta.env.VITE_APP_ENV === 'production' 
          ? `https://dev-connect-invw.onrender.com/api/user/${user._id}/friend-requests`
          : `http://localhost:5000/api/user/${user._id}/friend-requests`;

        const showConnections = import.meta.env.VITE_APP_ENV === 'production' 
          ? `https://dev-connect-invw.onrender.com/api/user/${user._id}/connections`
          : `http://localhost:5000/api/user/${user._id}/connections`;

        fetch(getAllUsers)
          .then(res => res.json())
          .then(data => {
            const filteredUsers = data.filter(u => !user.connections.includes(u._id) && u._id !== user._id);
            setUsers(filteredUsers);
            setLoading(false);
          })
          .catch(err => console.error("Error fetching users:", err));

        fetch(showConnections)
          .then(res => res.json())
          .then(data => {
            setConnections(data);
          })
          .catch(err => console.error("Error fetching connections:", err));

        // Get friend requests for logged-in user
        fetch(showFriendRequests)
            .then(async (res) => {
                const text = await res.text(); // Read raw response
                try {
                    const json = JSON.parse(text);
                    if (Array.isArray(json)) {
                        setFriendRequests(json);
                    } else {
                        console.error("Friend requests response is not an array:", json);
                        setFriendRequests([]);
                    }
                } catch (error) {
                    console.error("Friend requests response is not valid JSON:", text);
                }
            })
            .catch(err => console.error("Error fetching friend requests:", err));

    }, [user]);

    // Send a friend request
    const sendFriendRequest = (targetUserId) => {
    fetch(sendRequest, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },

        body: JSON.stringify({ userId: user._id, targetUserId })

        })
        .then(() => {
          setSentRequests([...sentRequests, targetUserId]);

        }).catch(err => console.error("Error sending request:", err));
    };

    // Accept a friend request
    const acceptFriendRequest = (requesterId) => {
        fetch(acceptRequest, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            },

            body: JSON.stringify({ userId: user._id, requesterId })

        }).then(() => {
            alert("Friend request accepted!");

            setFriendRequests(friendRequests.filter((req) => req._id !== requesterId)); // Remove from UI

        }).catch(err => console.error("Error accepting request:", err));
    };

    return (
        <div className="network-container">
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
      
        <h2>Find Connections</h2>
        {loading ? <p>Loading...</p> : (
          <div className="users-list">
            {user && users.map((otherUser) => (
            otherUser._id !== user._id && (  // Ensure user doesn’t see themselves
                <div key={otherUser._id} className="connection-card">
                  <img src={otherUser.profilePicture || `${BlankProfilePic}`} alt={otherUser.name} className="user-pic" />
                  <h3>{otherUser.name}</h3>
                  <p>{otherUser.headline || "No headline available"}</p>
                  <button 
                    onClick={() => sendFriendRequest(otherUser._id)}
                    disabled={sentRequests.includes(otherUser._id)}
                  >
                  {sentRequests.includes(otherUser._id) ? "Pending" : "Connect"}
                  </button>
                </div>
            )
            ))}
          </div>
        )}
  
        <h2>Incoming connections</h2>
        {friendRequests.length > 0 ? (
          <div className="requests-list">
            {friendRequests.map((requester) => (
              <div key={requester._id} className="request-card">
                <img src={requester.profilePicture || `${BlankProfilePic}`} alt="Profile" className="user-pic" />
                <h3>{requester.name}</h3>
                <p>{requester.headline}</p>
                <button onClick={() => acceptFriendRequest(requester._id)}>Accept</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending requests</p>
        )}
      </div>
    );
  };

export default Network;