import mongoose from "mongoose";

const resumeAssetSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Singleton, same enforcement pattern as AboutContent — no delete method
// exists anywhere (repository or routes), and only get-or-create + update
// are ever exposed.
const ResumeAsset = mongoose.model("ResumeAsset", resumeAssetSchema);

export default ResumeAsset;
