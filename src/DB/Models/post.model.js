import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minLength: 2,
      maxLength: 50000,
      trim: true,
      required: function () {
        return this.attachments.length ? false : true;
      },
    },
    attachments: [{ secure_url: String, public_id: String }],
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    tags: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    createdBy: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    updatedBy: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    deletedBy: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const postModel = mongoose.model("Post", postSchema);
