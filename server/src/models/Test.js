import mongoose from "mongoose";

const TestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    fastingRequired: { type: Boolean, default: false },
    reportTime: { type: String, required: true },
    category: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Test", TestSchema);
