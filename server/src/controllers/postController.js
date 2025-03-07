import Message from "../models/Post.js";

// Create a new message
export const createMessage = async (req, res) => {
    try {
        const newMessage = new Message({
            user: req.user.id,  // Get user ID from auth middleware
            content: req.body.content,
        });

        await newMessage.save();
        const populatedMessage = await newMessage.populate('user', 'username profilePicture')


        res.json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().populate("user", "username profilePicture").sort({ createdAt: -1 });;
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        // Find the message by ID
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check if the logged-in user is the author of the message
        if (message.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        // Update the content
        message.content = content;
        await message.save();

        const updatedMessage = await message.populate('user', 'username profilePicture');

        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a message
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        // Find the message by ID
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check if the logged-in user is the author of the message
        if (message.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        await Message.findByIdAndDelete(messageId);

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const likeMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({error: "Message not found"})
        
        const userId = req.user.id;

        if (message.likedBy.includes(userId)) {
            message.likedBy = message.likedBy.filter(id => id.toString() !== userId);
            message.likes -= 1;
        } else {
            message.likedBy.push(userId);
            message.likes += 1;
        }

        await message.save();
        res.json({ likes: message.likes, likedBy: message.likedBy})
    } catch (error) {
        res.status(500).json({error: "Server error"});
    }
};