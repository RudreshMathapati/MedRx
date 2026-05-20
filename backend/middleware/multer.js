import multer from "multer";
import fs from "fs";

// Storage for signatures
const signatureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/signatures";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// Storage for hospital templates
const templateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/templates";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

export const uploadSignature = multer({ storage: signatureStorage });
export const uploadTemplate = multer({ storage: templateStorage });