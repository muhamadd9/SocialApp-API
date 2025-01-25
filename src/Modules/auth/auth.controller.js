import { Router } from "express";
import * as userService from "./auth.service.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as authSchemas from "./auth.validation.js";

const router = Router();

router.post(
  "/verify",
  validation(authSchemas.sendOTP),
  asyncHandler(userService.sendOTP)
);
router.post(
  "/register",
  validation(authSchemas.registerSchema),
  asyncHandler(userService.register)
);
router.post(
  "/login",
  validation(authSchemas.loginSchema),
  asyncHandler(userService.login)
);

router.post(
  "/forget-password",
  validation(authSchemas.forgetPassword),
  asyncHandler(userService.forgetPassword)
);

router.post(
  "/reset-password",
  validation(authSchemas.resetPassword),
  asyncHandler(userService.resetPassword)
);

router.post(
  "/new_access_token",
  validation(authSchemas.newAccessToken),
  asyncHandler(userService.newAccessToken)
);

router.post(
  "/loginWithGmail",
  validation(authSchemas.loginWithGmail),
  asyncHandler(userService.loginWithGmail)
)

export default router;
