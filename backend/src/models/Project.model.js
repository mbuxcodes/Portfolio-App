import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title must be at most 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // Indexed explicitly (in addition to `unique`, which already indexes it)
      // to document intent clearly: this field is looked up directly on
      // every /projects/:slug request per Architecture Doc 3.
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: ["Personal", "Freelance", "Open Source", "Academic"],
        message: "{VALUE} is not a valid project category",
      },
      required: [true, "Category is required"],
    },
    techStack: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },
    gallery: {
      type: [String],
      default: [],
    },
    problem: {
      type: String,
      required: [true, "Problem description is required"],
      minlength: [20, "Problem description should be at least 20 characters"],
    },
    solution: {
      type: String,
      required: [true, "Solution description is required"],
      minlength: [20, "Solution description should be at least 20 characters"],
    },
    results: {
      type: String,
      required: [true, "Results description is required"],
      minlength: [20, "Results description should be at least 20 characters"],
    },
    role: {
      type: String,
      default: null,
    },
    liveLink: {
      type: String,
      default: null,
    },
    githubLink: {
      type: String,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "published"],
        message: "{VALUE} is not a valid status",
      },
      default: "draft",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
