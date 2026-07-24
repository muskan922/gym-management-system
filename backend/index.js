import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import connectDB from "./db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

/* ==========================
   Security Middleware
========================== */

// Secure HTTP headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Parse Cookies
app.use(cookieParser());

/* ==========================
   Rate Limiter
========================== */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

/* ==========================
   Logging
========================== */

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* ==========================
   Health Check
========================== */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date(),
  });
});

/* ==========================
   API Routes
========================== */

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);

/* ==========================
   404 Handler
========================== */

app.use("*", (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

/* ==========================
   Global Error Handler
========================== */

app.use(errorHandler);

/* ==========================
   Server
========================== */

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});