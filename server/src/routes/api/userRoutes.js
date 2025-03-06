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

router.get("/:userId/repos", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        console.log("Sending selected repositories:", user.selectedRepositories);
        res.json({ selectedRepositories: user.selectedRepositories });
    } catch (error) {
        console.error("Error fetching repositories:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/update-repos", async (req, res) => {
    try {
        const { userId, selectedRepositories } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Ensure repos are properly structured before saving
        user.selectedRepositories = selectedRepositories.map(repo => ({
            name: repo.name,
            url: repo.url,
            deployedURL: repo.deployedURL,
            description: repo.description,
            language: repo.language,
            image: repo.image,
        }));

        await user.save();
        res.json({ message: "Repositories updated successfully", selectedRepositories: user.selectedRepositories });

    } catch (error) {
        console.error("Error updating repositories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/all-users", async (_req, res) => {
    try {
      const users = await User.find().select("name headline profilePicture username"); 
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.get("/:userId/friend-requests", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("friendRequests", "name headline profilePicture");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.friendRequests || []);
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:userId/connections", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("connections", "name headline profilePicture");

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.connections);
    } catch (error) {
        console.error("Error displaying connections:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/send-request", async (req, res) => {
    try {
        const { userId, targetUserId } = req.body;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (targetUser.friendRequests.includes(userId)) {
            return res.status(400).json({ message: "Request already sent" });
        }

        targetUser.friendRequests.push(userId);
        await targetUser.save();

        res.status(200).json({ message: "Friend request sent" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/accept-request", async (req, res) => {
    try {
        const { userId, requesterId } = req.body;

        const user = await User.findById(userId);
        const requester = await User.findById(requesterId);

        if (!user || !requester) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove from friendRequests
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
        requester.friendRequests = requester.friendRequests.filter(id => id.toString() !== userId);

        // Add to connections
        if (!user.connections.includes(requesterId)) {
            user.connections.push(requesterId);
        }
        if (!requester.connections.includes(userId)) {
            requester.connections.push(userId);
        }

        await user.save();
        await requester.save();

        res.status(200).json({ message: "Friend request accepted", connections: user.connections });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;