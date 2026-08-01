import cloudinary from "../config/cloudinary.js";
import { resumeRepository } from "../repositories/resume.repository.js";

// A fixed public ID means every upload OVERWRITES the same Cloudinary asset,
// rather than accumulating old resume versions forever — matching Architecture
// Doc 3's "replaces the previously active resume" requirement directly.
const RESUME_PUBLIC_ID = "portfolio/resume/current-resume";

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: RESUME_PUBLIC_ID,
        resource_type: "raw", // PDFs are non-image assets in Cloudinary's model
        overwrite: true,
        invalidate: true, // bust any CDN cache of the old file at the same URL
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
}

export const resumeService = {
  async getResume() {
    const existing = await resumeRepository.findSingleton();
    if (existing) {
      return existing;
    }
    return resumeRepository.createDefault();
  },

  async uploadResume(fileBuffer) {
    const uploadResult = await uploadBufferToCloudinary(fileBuffer);

    const existing = await this.getResume();
    return resumeRepository.updateSingleton(existing._id, {
      url: uploadResult.secure_url,
    });
  },
};
