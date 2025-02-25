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

router.put("/update-profile", async (req, res) => {
    try {
        const { userId, name, headline, bio, githubUsername, experience, skills } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, headline, bio, githubUsername, experience, skills },
            { new: true } // Ensures updated user is returned
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        console.log("Updated User Data:", updatedUser); // Debugging
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;