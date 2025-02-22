import express from "express";
import { createMessage, getMessages } from "../../controllers/messageController.js";
import authMiddleware from "../../utils/authJWT.js"; 

const router = express.Router();

router.post("/message-board", authMiddleware, createMessage);

// Get all messages
router.get("/message-board", getMessages);

export default router;
