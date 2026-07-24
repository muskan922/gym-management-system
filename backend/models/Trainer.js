import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Trainer name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid phone number",
      ],
    },

    specialty: {
      type: String,
      required: [true, "Specialty is required"],
      trim: true,
      maxlength: 100,
    },

    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: 0,
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      uppercase: true,
    },

    image: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
      maxlength: 250,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes

trainerSchema.index({ specialty: 1 });
trainerSchema.index({ status: 1 });

export default mongoose.model("Trainer", trainerSchema);