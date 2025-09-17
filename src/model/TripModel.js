const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: [true, "Trip reference is required"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    seats: {
      type: Number,
      required: true,
      min: [1, "At least 1 seat must be booked"],
    },

    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    bookedAt: {
      type: Date,
      default: Date.now,
    },

    paymentId: {
      type: String, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
