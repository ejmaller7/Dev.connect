import { useState, useEffect } from "react";
import { useUser } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import "../css/MessageBoard.css"; 
import defaultProfile from "../../assets/images/BlankProfilePicture.webp"

const API_BASE_URL = import.meta.env.VITE_APP_ENV === "production"
    ? "https://dev-connect-invw.onrender.com"
    : "http://localhost:5000";

const PostBoard = () => {
  const { isAuthenticated, user } = useUser();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [authChecked, setAuthChecked] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [showComments, setShowComments] = useState({});  
  const [showCommentForm, setShowCommentForm] = useState({});

  useEffect(() => {
      if (!authChecked) {
          setAuthChecked(true);
      } else if (!isAuthenticated) {
          navigate("/welcome");
      }
  }, [isAuthenticated, navigate, authChecked]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/message-board`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error("Error fetching messages");
        }
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };
    fetchMessages();
  }, [isAuthenticated]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/message-board`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        console.error("Error posting message");
        return;
      }

      setMessage("");
      const newMessage = await response.json();
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    } catch (error) {
      console.error("Error posting message", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/message-board/${messageId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (response.ok) {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
      } else {
        const errorData = await response.json();
        console.error("Error deleting message:", errorData.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error deleting message", error);
    }
  };

  const handleEditMessage = (messageId) => {
    const newContent = prompt("Edit your message:");
    if (newContent) {
      try {
        fetch(`${API_BASE_URL}/api/message-board/${messageId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({ content: newContent }),
        }).then((response) => {
          if (response.ok) {
            setMessages((prevMessages) => 
              prevMessages.map((msg) =>
                msg._id === messageId ? { ...msg, content: newContent } : msg
              )
            );
          } else {
            console.error("Error updating message");
          }
        });
      } catch (error) {
        console.error("Error updating message", error);
      }
    }
  };

  const handleLike = async (messageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/message-board/like/${messageId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((msg) =>
              msg._id === messageId ? { ...msg, likes: data.likes, likedBy: data.likedBy } : msg
          );
          return updatedMessages;
        });
      } else {
        console.error("Error liking message");
      }
    } catch (error) {
      console.error("Error liking message", error);
    }
  };

  const handleCommentSubmit = async (messageId) => {
    if (!commentTexts[messageId]?.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/message-board/comments/${messageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ text: commentTexts[messageId] }),
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? updatedMessage : msg
          )
        );
        setCommentTexts((prev) => ({ ...prev, [messageId]: "" }));
      } else {
        console.error("Error posting comment");
      }
    } catch (error) {
      console.error("Error posting comment", error);
    }
  };

  const toggleCommentsVisibility = (messageId) => {
    setShowComments((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const handleToggleCommentForm = (messageId) => {
    setShowCommentForm((prevState) => ({
      ...prevState,
      [messageId]: !prevState[messageId],
    }));
  };

  return (
    <div className="message-board-container">
      <h2 className="message-board-title">Community Feed</h2>

      {isAuthenticated && (
        <button className="private-messages-btn" onClick={() => navigate("/messages")}>
          My Private Messages
        </button>
      )}

      {isAuthenticated && (
        <form className="message-form" onSubmit={handleMessageSubmit}>
          <textarea
            className="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
          />
          <button className="post-btn" type="submit">
            Post Message
          </button>
        </form>
      )}

      <div className="messages-container">
        {messages.slice(0, visibleCount).map((msg) => (
          <div className="message-item" key={msg._id}>
            <div className="message-header">
              {msg.user.profilePicture && msg.user.profilePicture.trim() !== "" ? (
                <img src={msg.user.profilePicture} alt="User Profile" className="message-profile-picture" />
              ) : (
                <img src={defaultProfile} alt="Default Profile" className="default-profile" />
              )}
              <strong className="username">{msg.user?.username || "Unknown User"}</strong>
            </div>
            <p className="message-text">{msg.content}</p>
            <small className="message-time">{new Date(msg.createdAt).toLocaleString()}</small>

            <div className="comments-section">
              {isAuthenticated && (
                <div className="comment-form">
                  <button
                    className={`like-btn ${msg.likedBy.includes(user._id) ? "liked" : ""}`}
                    onClick={() => handleLike(msg._id)}
                  >
                    ❤️ {msg.likes}
                  </button>
                  <button
                    onClick={() => handleToggleCommentForm(msg._id)}
                    className="add-comment-btn"
                  >
                    💬
                  </button>
                </div>
              )}

              {msg.comments.length > 0 && ( 
                <button
                  className="view-comments-btn"
                  onClick={() => toggleCommentsVisibility(msg._id)}
                >
                  {showComments[msg._id] ? "Hide Comments" : "View Comments"}
                </button>
              )}
            </div>

            {showComments[msg._id] && msg.comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  {comment.user.profilePicture && comment.user.profilePicture.trim() !== "" ? (
                    <img
                      src={comment.user.profilePicture}
                      alt={`${comment.user.username}'s Profile`}
                      className="comment-profile-picture"
                    />
                  ) : (
                    <img
                      src={defaultProfile} 
                      alt="Default Profile" 
                      className="comment-profile-picture"
                    />
                  )}
                  <strong className="comment-username">{comment.user?.username || "Unknown User"}</strong>

                </div>
                <p className="comment-text">{comment.text}</p>
                <small className="comment-time">{new Date(comment.createdAt).toLocaleString()}</small>
              </div>
            ))}

            {showCommentForm[msg._id] && (
                <div className="bootstrap-wrapper">
                  <input type="text" className="form-control" placeholder="Type comment..." value={commentTexts[msg._id] || ""}
          onChange={(e) => setCommentTexts({ ...commentTexts, [msg._id]: e.target.value })} />
                  <button onClick={() => handleCommentSubmit(msg._id)} className="btn btn-primary mt-2">Post</button>
                </div>
            )}

  
            {msg.user && user && msg.user._id === user._id && (
              <div className="message-actions">
                <button onClick={() => handleEditMessage(msg._id)}>Edit</button>
                <button onClick={() => handleDeleteMessage(msg._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {visibleCount < messages.length && (
        <button className="show-more-btn" onClick={() => setVisibleCount((prev) => prev + 10)}>
          Show More
        </button>
      )}
    </div>
  );
};

export default PostBoard;






