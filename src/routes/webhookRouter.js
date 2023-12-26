import express from "express";
import {
  handleVerification,
  handleWebhookPost,
} from "../controllers/messageControllers.js";

const router = express.Router();

router.get("/", handleVerification);
router.post("/", handleWebhookPost);

export default router;
