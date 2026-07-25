import multer from "multer";
import AppError from "../utils/AppError.js";

/**
 * Memory storage, not disk storage — the uploaded file lives only in RAM
 * as a Buffer until we stream it to Cloudinary, then it's discarded. This
 * matters specifically for Render's free tier (and most PaaS platforms):
 * the local filesystem isn't guaranteed to persist between restarts, so
 * writing to disk here would be actively unsafe, not just unnecessary.
 */
const storage = multer.memoryStorage();

const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024; // 10MB, per Architecture Doc 3

function pdfFileFilter(req, file, cb) {
  if (file.mimetype !== "application/pdf") {
    return cb(
      new AppError(
        "Only PDF files are allowed for the resume",
        400,
        "INVALID_FILE_TYPE",
      ),
    );
  }
  cb(null, true);
}

export const uploadResume = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: MAX_RESUME_SIZE_BYTES },
}).single("resume"); // field name matches Architecture Doc 3's multipart contract
