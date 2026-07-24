import express from "express";

import {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";

import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// =========================
// Membership Plan Routes
// =========================

// Get all plans
router.get("/", authorize("ADMIN", "TRAINER"), getPlans);

// Get single plan
router.get("/:id", authorize("ADMIN", "TRAINER"), getPlanById);

// Create new plan
router.post("/", authorize("ADMIN"), createPlan);

// Update plan
router.put("/:id", authorize("ADMIN"), updatePlan);

// Delete plan
router.delete("/:id", authorize("ADMIN"), deletePlan);

export default router;