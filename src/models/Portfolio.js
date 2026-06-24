import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    profile: { type: mongoose.Schema.Types.Mixed, required: true },
    site: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
