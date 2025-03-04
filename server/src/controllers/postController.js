import PrivateMessage from "../models/Post.js";

export const sendPrivateMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  const senderId = req.user._id; 

  if (!recipientId || !content) {
    return res.status(400).json({ error: "Recipient and message content are required." });
  }

  try {
    const message = new PrivateMessage({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message." });
  }
};

export const getPrivateMessages = async (req, res) => {
    const { recipientId } = req.params;
    const senderId = req.user._id;
  
    try {
      const messages = await PrivateMessage.find({
        $or: [
          { sender: senderId, recipient: recipientId },
          { sender: recipientId, recipient: senderId },
        ],
      }).sort({ createdAt: -1 }); 
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages." });
    }
  };
  
  export const deletePrivateMessage = async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user._id;
  
    try {
      const message = await PrivateMessage.findById(messageId);
  
      if (!message) {
        return res.status(404).json({ error: "Message not found." });
      }
  
      if (message.sender.toString() !== userId.toString() && message.recipient.toString() !== userId.toString()) {
        return res.status(403).json({ error: "Not authorized to delete this message." });
      }
  
      await message.deleteOne();
      res.json({ success: "Message deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message." });
    }
  };

  export const getUsersWithMessages = async (req, res) => {
    const userId = req.user?._id;
    console.log(userId)
  
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    try {
      const messages = await PrivateMessage.find({
        $or: [
          { sender: userId }, 
          { recipient: userId }
        ]
      }).populate('sender recipient', 'username profilePicture');
      
      const users = messages.map((msg) => 
        msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender
      );
      console.log("Messages:", messages);
  
      const uniqueUsers = users.filter((value, index, self) =>
        index === self.findIndex((t) => t._id.toString() === value._id.toString())
      );
      console.log("Unique Users:", uniqueUsers);
  
      res.json(uniqueUsers);
    } catch (error) {
        console.error("Error fetching users with messages:", error.message, error.stack);
      res.status(500).json({ message: "Failed to fetch users with messages", error: error.message });
    }
  };
  
  
  