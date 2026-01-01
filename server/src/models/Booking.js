import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    mobile: { type: String, required: true },
    selectionType: { type: String, enum: ["test", "package"], required: true },
    selectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    homeCollection: { type: Boolean, default: false },
    address: { type: String },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "in_progress", "done"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
