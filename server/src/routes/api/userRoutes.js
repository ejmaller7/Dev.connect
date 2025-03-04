import express from "express";
import { loginUser } from "../../controllers/userController.js";
import User from "../../models/User.js"
import mongoose from "mongoose"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../config/cloudinary.js";

const router = express.Router();

// Set up Cloudinary storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile_pictures", // Folder name in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

const upload = multer({ storage });

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

// Profile Picture Upload Route
router.post("/upload-profile-picture", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const { userId } = req.body;
        const imageUrl = req.file.path;

        // Update user profile with new image URL
        const user = await User.findByIdAndUpdate(userId, { profilePicture: imageUrl }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile picture updated", profilePicture: imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/update-repos", async (req, res) => {
    try {
        const { userId, selectedRepositories } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        if (selectedRepositories.length > 8) {
            return res.status(400).json({ message: "You can only select up to 8 repositories." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { selectedRepositories },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Repositories updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating repositories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/all", async (_req, res) => {
    try {
      const users = await User.find({}, "username _id"); 
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

export default router;