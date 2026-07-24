import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
      unique: true,
      maxlength: 50,
    },

    durationMonths: {
      type: Number,
      required: [true, "Duration is required"],
      min: 1,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
membershipPlanSchema.index({ name: 1 });
membershipPlanSchema.index({ isActive: 1 });

export default mongoose.model(
  "MembershipPlan",
  membershipPlanSchema
);