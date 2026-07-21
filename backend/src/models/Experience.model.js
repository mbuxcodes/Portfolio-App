import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    location: {
      type: String,
      default: null,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      // null/absent means "Present" — enforced at the application layer,
      // not the schema, since "no end date" is a valid, meaningful state here.
      type: Date,
      default: null,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description should be at least 20 characters"],
    },
    techUsed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
