import express from "express";

import {
  getPayments,
  recordPayment,
  getPaymentById,
  deletePayment,
} from "../controllers/paymentController.js";

import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Protect all payment routes
router.use(protect);

// =========================
// Payment Routes
// =========================

// Get all payments
router.get("/", authorize("ADMIN"), getPayments);

// Get single payment
router.get("/:id", authorize("ADMIN"), getPaymentById);

// Record payment
router.post("/", authorize("ADMIN"), recordPayment);

// Delete payment
router.delete("/:id", authorize("ADMIN"), deletePayment);

export default router;