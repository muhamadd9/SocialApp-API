import fs from "fs";
import multer from "multer";
import path from "path";

const fileValidation = ["image/png", "image/jpeg", "image/jpg"];
export const uploadFileDisk = (customPath) => {
  const basePath = `uploads/${customPath}`;
  const fullPath = path.resolve(`./src/${basePath}`);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, fullPath);
    },
    filename: (req, file, callback) => {
      const finalFileName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;

      file.finalPath = basePath + "/" + finalFileName;
      callback(null, finalFileName);
    },
  });

  function fileFilter(req, file, callback) {
    if (fileValidation.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback("Invalid file", false);
    }
  }

  return multer({ dest: "tempPath", fileFilter, storage });
};
