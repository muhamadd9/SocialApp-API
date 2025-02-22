import { postModel } from "../../DB/Models/post.model.js";
import { cloud } from "../../utils/multer/cloudinary.multer.js";

export const createPost = async (req, res, next) => {
  const { content } = req.body;
  let attachments = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloud.uploader.upload(file.path, {
      folder: `${process.env.app_name}/post/${req.user._id}`,
    });
    attachments.push({ secure_url, public_id });
  }

  const post = await postModel.create({ content, attachments, createdBy: req.user._id });

  return res.status(201).json({ success: true, results: post });
};
