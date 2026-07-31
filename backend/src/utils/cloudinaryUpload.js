import cloudinary from "../config/cloudinary.js";

/**
 * Reusable buffer-to-Cloudinary upload, parameterized instead of hardcoded
 * per feature. Extracted per the Image Upload Audit (Issue #4) — without
 * this, building a new upload endpoint would mean copy-pasting the same
 * Promise-wrapped upload_stream logic already living in resume.service.js,
 * which is exactly the DRY violation the audit flagged.
 *
 * @param {Buffer} buffer - the file's raw bytes (from Multer's memory storage)
 * @param {Object} options
 * @param {string} options.folder - Cloudinary folder path, e.g. 'portfolio/uploads'
 * @param {string} [options.publicId] - fixed public ID (e.g. for a singleton
 *   asset like Resume, which always overwrites the same file). Omit to let
 *   Cloudinary generate a unique ID per upload — the correct choice for
 *   assets where many independent uploads accumulate (project images),
 *   as opposed to a singleton that should always replace itself.
 * @param {string} [options.resourceType='image'] - 'image' or 'raw'
 * @param {boolean} [options.overwrite=false] - only meaningful when publicId is set
 */
export function uploadBufferToCloudinary(
  buffer,
  { folder, publicId, resourceType = "image", overwrite = false },
) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      overwrite,
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
      uploadOptions.invalidate = true; // bust any CDN cache of the old file at the same URL
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
}

/**
 * Reusable asset deletion, paired with the upload function above (Phase 3 —
 * Cloudinary Asset Lifecycle Management). Deliberately swallows errors
 * rather than throwing: a failed deletion means an orphaned asset (a
 * storage-quota cost), which is a strictly lesser problem than failing an
 * otherwise-successful Project/Skill/About update or delete because
 * Cloudinary's cleanup step had a transient hiccup. Callers should log the
 * outcome, not treat it as blocking.
 *
 * @param {string} publicId
 * @param {string} [resourceType='image'] - must match what the asset was
 *   originally uploaded as ('image' or 'raw')
 * @returns {Promise<boolean>} true if deletion succeeded, false otherwise
 */
export async function deleteCloudinaryAsset(publicId, resourceType = "image") {
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === "ok";
  } catch (err) {
    console.error(
      `Failed to delete Cloudinary asset ${publicId}:`,
      err.message,
    );
    return false;
  }
}
