import express from "express";
import { loginUser } from "../../controllers/userController.js";
import User from "../../models/User.js"
import mongoose from "mongoose"

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already in use." });
        }

        // Create new user
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(), // Ensure a new unique _id
            username,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", userId: newUser._id });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;