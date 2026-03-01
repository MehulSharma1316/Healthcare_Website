import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    testsIncluded: [{ type: String, required: true }],
    idealFor: { type: String, required: true },
    active: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    imageUrl: { type: String },
    publicId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Package", PackageSchema);
