import express from "express";
import { sendPrivateMessage, getPrivateMessages, deletePrivateMessage, getUsersWithMessages } from "../../controllers/privateMessageController.js";
import authMiddleware from "../../utils/authJWT.js"; 

const router = express.Router();

router.post("/", authMiddleware, sendPrivateMessage);
router.get("/users", authMiddleware, getUsersWithMessages); // Move this line before the /:recipientId route
router.get("/:recipientId", authMiddleware, getPrivateMessages);
router.delete("/:messageId", authMiddleware, deletePrivateMessage);

export default router;