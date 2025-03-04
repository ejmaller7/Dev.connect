import express from "express";
import { sendPrivateMessage, getPrivateMessages, deletePrivateMessage, getUsersWithMessages } from "../../controllers/postController.js";
import authMiddleware from "../../utils/authJWT.js"; 

const router = express.Router();

router.post("/", authMiddleware, sendPrivateMessage);
router.get("/:recipientId", authMiddleware, getPrivateMessages);
router.delete("/:messageId", authMiddleware, deletePrivateMessage);
router.get("/users", authMiddleware, getUsersWithMessages);

export default router;