import { useState, useEffect } from "react";
import { useUser } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import "../css/MessageBoard.css"; 

const API_BASE_URL = import.meta.env.VITE_APP_ENV === "production"
    ? "https://dev-connect-invw.onrender.com"
    : "http://localhost:5000";

const PostBoard = () => {
    const { isAuthenticated, user } = useUser();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
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
    }, []);

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        console.log(message)

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

            console.log("response: ", response)

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
                        <p className="message-text">
                            <strong>{msg.user?.username || "Unknown User"}:</strong> {msg.content}
                        </p>
                        <small className="message-time">{new Date(msg.createdAt).toLocaleString()}</small>
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




