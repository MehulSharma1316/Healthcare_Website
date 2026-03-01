import mongoose from "mongoose";

const PosterSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    image: { type: String, required: true },
    publicId: { type: String },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Poster", PosterSchema);
