import Message from "../models/Message.js";

// Create a new message
export const createMessage = async (req, res) => {
    try {
        const newMessage = new Message({
            user: req.user.id,  // Get user ID from auth middleware
            content: req.body.content,
        });

        await newMessage.save();
        const populatedMessage = await newMessage.populate('user', 'username')


        res.json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().populate("user", "username").sort({ createdAt: -1 });;
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
