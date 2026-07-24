import express from "express";
import { body } from "express-validator";

import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Please enter a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  login
);

router.get("/me", protect, getMe);

router.put(
  "/update-profile",
  protect,
  [
    body("name").optional().trim(),
    body("email").optional().isEmail(),
  ],
  updateProfile
);

router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  changePassword
);

export default router;