import { Router } from "express";
import * as userService from "./user.service.js";
import isAuthenticaded from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import isAuthorized from "../../middleware/authoization.middleware.js";
import { roles } from "../../DB/Models/user.model.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as userValidationSchemas from "./user.validation.js";
import { uploadFileDisk } from "../../utils/multer/local.multer.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";

const router = Router();

// get user profile
router.get(
  "/profile",
  isAuthenticaded,
  isAuthorized(roles.user),
  asyncHandler(userService.profile)
);
// update profile
router.patch(
  "/profile",
  isAuthenticaded,
  isAuthorized(roles.user, roles.admin),
  validation(userValidationSchemas.updateProfileSchema),
  asyncHandler(userService.updateProfile)
);
// update password
router.patch(
  "/changePassword",
  isAuthenticaded,
  isAuthorized(roles.user, roles.admin),
  validation(userValidationSchemas.changePasswordSchema),
  asyncHandler(userService.changePassword)
);

// deactivate account
router.delete(
  "/deactivateAccount",
  isAuthenticaded,
  isAuthorized(roles.user, roles.admin),
  asyncHandler(userService.deactivateAcccount)
);

router.patch(
  "/updateEmail",
  isAuthenticaded,
  isAuthorized(roles.user),
  validation(userValidationSchemas.updateEmailSchema),
  asyncHandler(userService.updateEmail)
);

router.post(
  "/verifyUpdatedEmail",
  isAuthenticaded,
  isAuthorized(roles.user),
  validation(userValidationSchemas.verifyUpdatedEmailSchema),
  asyncHandler(userService.verifyUpdatedEmail)
);
// Update User Profile image local
router.patch(
  "/profile/image",
  isAuthenticaded,
  uploadFileDisk("profile").single("image"),
  userService.updateProfileImage
);

// Update User Profile image cloud
router.patch(
  "/profile/image/cloud",
  isAuthenticaded,
  uploadCloudFile().single("image"),
  userService.updateProfileImageCloud
);

export default router;
