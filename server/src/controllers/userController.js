import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        // Check if the user exists by email or username
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const registerUser = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        // Determine if input is an email or username
        const isEmail = emailOrUsername.includes("@");
        const field = isEmail ? "email" : "username";

        // Check if the user already exists
        const existingUser = await User.findOne({ [field]: emailOrUsername });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            [field]: emailOrUsername,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: newUser._id,
            token,
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
};