import express from "express";

import {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from "../controllers/trainerController.js";

import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// =========================
// Trainer Routes
// =========================

// Get all trainers
router.get("/", authorize("ADMIN", "TRAINER"), getTrainers);

// Get trainer by ID
router.get("/:id", authorize("ADMIN", "TRAINER"), getTrainerById);

// Create trainer
router.post("/", authorize("ADMIN"), createTrainer);

// Update trainer
router.put("/:id", authorize("ADMIN"), updateTrainer);

// Delete trainer
router.delete("/:id", authorize("ADMIN"), deleteTrainer);

export default router;