const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Completed", "Rejected"],
      default: "Submitted",
    },
    mobileNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Basic regex for 10-digit mobile numbers
          return /^\d{10}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit mobile number!`,
      },
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    age: { type: Number }, // Age as a number
    dob: { type: Date },
    documents: [
      {
        fieldName: String,
        filePath: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
