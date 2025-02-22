import { Router } from "express";
import * as postService from "./post.service.js";
import * as postValidation from "./post.validation.js";
import isAuthenticaded from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authoization.middleware.js";
import { roles } from "../../DB/Models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
const router = Router();

router.post(
  "/",
  isAuthenticaded,
  isAuthorized(roles.user),
//   validation(postValidation.createPost),
  uploadCloudFile().array("attachments", 10),
  asyncHandler(postService.createPost)
);


export default router;
