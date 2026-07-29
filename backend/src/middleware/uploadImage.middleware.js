import multer from "multer";
import AppError from "../utils/AppError.js";

const storage = multer.memoryStorage();

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, per Architecture Doc 3/17

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * MIME-type check only, same level of validation Resume's upload already
 * uses. The Image Upload Audit (Issue #2) flagged that client-supplied
 * MIME type is spoofable and recommended magic-byte inspection as
 * defense-in-depth — deliberately deferred to a later phase, not silently
 * skipped, per this phase's approved scope (utility + endpoint only).
 */
function imageFileFilter(req, file, cb) {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new AppError(
        "Only JPG, PNG, and WEBP images are allowed",
        400,
        "INVALID_FILE_TYPE",
      ),
    );
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
}).single("image"); // field name matches Architecture Doc 3's multipart contract
