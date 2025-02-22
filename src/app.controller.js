import connectDB from "./DB/connection.js";
import authController from "./Modules/auth/auth.controller.js";
import postController from "./Modules/post/post.controller.js";
import userController from "./Modules/user/user.controller.js";
import { globalErrorHandler } from "./utils/errorHandling/globalErrorHandlng.js";
import { notFoundHandler } from "./utils/errorHandling/notFoundHandler.js";
import cors from "cors";
import path from "path";

const bootstrap = (app, express) => {
  connectDB();
  app.use(cors());
  app.use("/uploads", express.static(path.resolve("./src/uploads")));
  app.use(express.json());

  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/post", postController);

  app.all("*", notFoundHandler);

  app.use(globalErrorHandler);
};

export default bootstrap;
