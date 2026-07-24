import express from "express";

import {
  getAttendanceByDate,
  markAttendance,
  getMemberAttendanceHistory,
  getAttendanceStats,
} from "../controllers/attendanceController.js";

import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", authorize("ADMIN", "TRAINER"), getAttendanceByDate);

router.post("/", authorize("ADMIN", "TRAINER"), markAttendance);

router.get("/stats", authorize("ADMIN", "TRAINER"), getAttendanceStats);

router.get(
  "/member/:memberId",
  authorize("ADMIN", "TRAINER"),
  getMemberAttendanceHistory
);

export default router;