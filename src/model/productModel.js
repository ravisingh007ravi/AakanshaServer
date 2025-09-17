const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    productImg: { type: Object, required: false, trim: true },
    title: {
      type: String,
      required: [true, "Trip title is required"],
      trim: true,
      unique: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Trip description is required"],
      trim: true,
      minlength: [10, "Description should be at least 10 characters"],
    },

    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String },
    },

    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value > Date.now(),
        message: "Start date must be in the future",
      },
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },

    price: { type: Number, required: true, min: 0 },

    discount: { type: Number, default: 0, min: 0, max: 100 },

    maxPeople: { type: Number, required: true, min: 1 },

    availableSlots: {
      type: Number,
      default: function () {
        return this.maxPeople;
      },
      validate: {
        validator: function (value) {
          return value <= this.maxPeople;
        },
        message: "Available slots cannot exceed maxPeople",
      },
    },

    itinerary: [
      {
        day: { type: Number, required: true },
        activities: [{ type: String, required: true }],
      },
    ],

    inclusions: [String],
    exclusions: [String],

    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },

    coordinates: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin User
      required: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

tripSchema.pre("save", function (next) {
  if (this.availableSlots > this.maxPeople) {
    this.availableSlots = this.maxPeople;
  }
  next();
});

module.exports = mongoose.model("Trip", tripSchema);
