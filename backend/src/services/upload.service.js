import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

// Shared folder for this general-purpose endpoint — used across Project
// cover/gallery images and About's profile image (Architecture Doc 3: "a
// single shared endpoint rather than duplicating upload logic per feature").
const UPLOAD_FOLDER = "portfolio/uploads";

export const uploadService = {
  /**
   * No publicId is passed here — deliberately, unlike Resume's singleton
   * pattern. This endpoint serves many independent images across many
   * different Projects/About over time, so each upload should get its own
   * unique Cloudinary asset (auto-generated ID), not overwrite a shared one.
   */
  async uploadImage(fileBuffer) {
    const uploadResult = await uploadBufferToCloudinary(fileBuffer, {
      folder: UPLOAD_FOLDER,
      resourceType: "image",
    });

    return { url: uploadResult.secure_url, publicId: uploadResult.public_id };
  },
};
