import mongoose from "mongoose";

const gymSettingsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: "default",
    },

    gymName: {
      type: String,
      required: [true, "Gym name is required"],
      trim: true,
      maxlength: 100,
      default: "Powerhouse Gym",
    },

    gymAddress: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "123 Fitness Street, Gym City",
    },

    phone: {
      type: String,
      trim: true,
      default: "+1234567890",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "info@powerhousegym.com",
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ],
    },

    currency: {
      type: String,
      uppercase: true,
      trim: true,
      enum: ["USD", "INR", "EUR", "GBP"],
      default: "INR",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("GymSettings", gymSettingsSchema);