import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ["Frontend", "Backend", "Database", "DevOps", "Tools"],
        message: "{VALUE} is not a valid skill category",
      },
      required: [true, "Skill category is required"],
    },
    proficiency: {
      type: String,
      enum: {
        values: ["Beginner", "Intermediate", "Advanced", "Expert"],
        message: "{VALUE} is not a valid proficiency level",
      },
      required: [true, "Proficiency level is required"],
    },
    narrative: {
      type: String,
      required: [true, "A narrative describing real-world usage is required"],
      minlength: [
        20,
        "Narrative should be at least 20 characters — a single word is not enough context",
      ],
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

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
