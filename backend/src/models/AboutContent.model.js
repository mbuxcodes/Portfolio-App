import mongoose from "mongoose";

const aboutContentSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      // Deliberately NOT required, unlike most text fields elsewhere in this
      // codebase — see the note below and Architecture Doc 2's Implementation
      // Notes for why.
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: null,
    },
    highlights: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

// NOTE: MongoDB has no native "max one document" constraint. The schema
// alone cannot enforce singleton behavior — that's deliberately enforced
// one layer up, in aboutContent.service.js (Milestone 2, later step),
// which will only ever expose getAboutContent() and updateAboutContent(),
// with no createAboutContent() reachable via any route. See Architecture
// Doc 2's "Key Modeling Decisions" section for the full reasoning.
const AboutContent = mongoose.model("AboutContent", aboutContentSchema);

export default AboutContent;
