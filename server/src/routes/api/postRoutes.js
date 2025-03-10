import express from "express";
import { createMessage, getMessages, updateMessage, deleteMessage, likeMessage, commentOnMessage } from "../../controllers/postController.js";
import authMiddleware from "../../utils/authJWT.js";
import multer from "multer"; 

const router = express.Router();
const upload = multer({Storage: multer.memoryStorage()})

router.post("/message-board", authMiddleware, upload.single("image"), createMessage);

// Get all messages
router.get("/message-board", getMessages);

router.put("/message-board/:messageId", authMiddleware, updateMessage);

router.delete("/message-board/:messageId", authMiddleware, deleteMessage);

router.post("/message-board/comments/:id", authMiddleware, commentOnMessage)

router.put("/message-board/like/:id", authMiddleware, likeMessage)

export default router;
