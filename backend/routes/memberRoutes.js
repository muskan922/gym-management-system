import express from "express";

import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";

import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Protect all member routes
router.use(protect);

// =========================
// Member Routes
// =========================

// View all members
router.get("/", authorize("ADMIN", "TRAINER"), getMembers);

// View single member
router.get("/:id", authorize("ADMIN", "TRAINER"), getMemberById);

// Create member
router.post("/", authorize("ADMIN"), createMember);

// Update member
router.put("/:id", authorize("ADMIN"), updateMember);

// Delete member
router.delete("/:id", authorize("ADMIN"), deleteMember);

export default router;