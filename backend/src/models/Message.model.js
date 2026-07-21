import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be at most 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    reason: {
      type: String,
      enum: {
        values: ["Job Opportunity", "Freelance", "General", "Other"],
        message: "{VALUE} is not a valid reason",
      },
      required: [true, "Reason is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [2000, "Message must be at most 2000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["new", "read", "replied", "archived"],
        message: "{VALUE} is not a valid status",
      },
      default: "new",
    },
    adminNotes: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Compound index: the admin inbox constantly filters by status and sorts by
// newest first (Architecture Doc 2) — this index serves both in one pass.
messageSchema.index({ status: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
