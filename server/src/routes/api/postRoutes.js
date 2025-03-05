import express from "express";
import { createMessage, getMessages, updateMessage, deleteMessage } from "../../controllers/postController.js";
import authMiddleware from "../../utils/authJWT.js"; 

const router = express.Router();

router.post("/message-board", authMiddleware, createMessage);

// Get all messages
router.get("/message-board", getMessages);

router.put("/message-board/:messageId", authMiddleware, updateMessage);

router.delete("/message-board/:messageId", authMiddleware, deleteMessage);

export default router;
