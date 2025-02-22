import fs from "fs";
import multer from "multer";
import path from "path";

const fileValidation = ["image/png", "image/jpeg", "image/jpg"];
export const uploadCloudFile = (customPath) => {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, callback) {
    if (fileValidation.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback("Invalid file", false);
    }
  }

  return multer({ dest: "tempPath", fileFilter, storage });
};
