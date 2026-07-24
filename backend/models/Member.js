import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Member name is required"],
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

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "INACTIVE"],
      default: "ACTIVE",
      uppercase: true,
    },

    membershipStart: {
      type: Date,
      required: true,
    },

    membershipEnd: {
      type: Date,
      required: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
      index: true,
    },

    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      default: null,
      index: true,
    },

    emergencyContact: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
      maxlength: 250,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes

memberSchema.index({ status: 1 });
memberSchema.index({ membershipEnd: 1 });

export default mongoose.model("Member", memberSchema);