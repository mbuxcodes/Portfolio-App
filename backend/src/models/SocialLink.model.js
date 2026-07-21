import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, "Platform name is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      match: [/^https?:\/\/.+/, "URL must start with http:// or https://"],
    },
    icon: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const SocialLink = mongoose.model("SocialLink", socialLinkSchema);

export default SocialLink;
