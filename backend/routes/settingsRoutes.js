import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// =========================
// Gym Settings Routes
// =========================

// View gym settings
router.get("/", authorize("ADMIN"), getSettings);

// Update gym settings
router.put("/", authorize("ADMIN"), updateSettings);

export default router;