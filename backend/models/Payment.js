import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member is required"],
      index: true,
    },

    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: 0,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["CASH", "CARD", "UPI", "BANK_TRANSFER"],
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PAID", "PENDING", "FAILED", "REFUNDED"],
      default: "PAID",
      uppercase: true,
    },

    transactionId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
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
paymentSchema.index({ memberId: 1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ status: 1 });

export default mongoose.model("Payment", paymentSchema);