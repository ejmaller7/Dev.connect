import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/Auth";

const API_BASE_URL = import.meta.env.VITE_APP_ENV === "production"
    ? "https://dev-connect-invw.onrender.com"
    : "http://localhost:5000";

const PrivateMessageConversation = () => {
  const { userId } = useParams();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`${API_BASE_URL}/api/private-messages/${userId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/private-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ recipientId: userId, content: newMessage }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages((prevMessages) => [message, ...prevMessages]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="message-conversation">
      <h2>Conversation with {userId}</h2>
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg._id} className={`message ${msg.sender === user._id ? "sent" : "received"}`}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default PrivateMessageConversation;
