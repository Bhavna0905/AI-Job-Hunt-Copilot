const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected", "Offer"],
      default: "Applied",
    },

    date: {
      type: String,
    },

    notes: {
      type: String,
      trim: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);