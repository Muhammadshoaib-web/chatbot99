import express from "express";
import {
  handleWebhookGetController,
  handleWebhookPostController,
} from "../controllers/messageControllers.js";

const router = express.Router();

router.get("/webhook", handleWebhookGetController);
router.post("/webhook", handleWebhookPostController);

export default router;
