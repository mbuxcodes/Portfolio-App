import { projectRepository } from "../repositories/project.repository.js";
import { slugify } from "../utils/slugify.js";
import { sanitizeRichText } from "../utils/sanitizeHtml.js";
import { deleteCloudinaryAsset } from "../utils/cloudinaryUpload.js";
import AppError from "../utils/AppError.js";

/**
 * Generates a unique slug from a title. If "my-project" already exists,
 * tries "my-project-2", "my-project-3", etc. This runs at the service layer
 * (not the model) because it requires a database lookup — schema-level
 * validation can't check "does this already exist" on its own.
 */
async function generateUniqueSlug(title) {
  const baseSlug = slugify(title);
  let candidateSlug = baseSlug;
  let suffix = 2;

  while (await projectRepository.findBySlug(candidateSlug)) {
    candidateSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidateSlug;
}

function sanitizeProjectRichTextFields(data) {
  const sanitized = { ...data };
  if (sanitized.problem)
    sanitized.problem = sanitizeRichText(sanitized.problem);
  if (sanitized.solution)
    sanitized.solution = sanitizeRichText(sanitized.solution);
  if (sanitized.results)
    sanitized.results = sanitizeRichText(sanitized.results);
  return sanitized;
}

export const projectService = {
  async getPublishedProjects({ category, tech }) {
    const filter = {};
    if (category) filter.category = category;
    if (tech) filter.techStack = tech;
    return projectRepository.findPublished(filter);
  },

  async getPublishedProjectBySlug(slug) {
    const project = await projectRepository.findPublishedBySlug(slug);
    if (!project) {
      throw new AppError("Project not found", 404, "NOT_FOUND");
    }
    return project;
  },

  async getAllProjectsForAdmin({ category, status }) {
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    return projectRepository.findAll(filter);
  },

  async getProjectByIdForAdmin(id) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError("Project not found", 404, "NOT_FOUND");
    }
    return project;
  },

  async createProject(data) {
    const slug = await generateUniqueSlug(data.title);
    const sanitizedData = sanitizeProjectRichTextFields(data);
    return projectRepository.create({ ...sanitizedData, slug });
  },

  async updateProject(id, data) {
    const existingProject = await projectRepository.findById(id);
    if (!existingProject) {
      throw new AppError("Project not found", 404, "NOT_FOUND");
    }

    const sanitizedData = sanitizeProjectRichTextFields(data);

    // Only regenerate the slug if the title actually changed — otherwise
    // every minor edit (e.g. fixing a typo in the description) would
    // needlessly change the project's public URL, breaking any existing
    // links to it (a real, easy-to-miss bug this guard prevents).
    if (data.title && data.title !== existingProject.title) {
      sanitizedData.slug = await generateUniqueSlug(data.title);
    }

    // Determine what (if anything) needs Cloudinary cleanup BEFORE writing
    // to the DB — but don't actually delete yet. The DB write must succeed
    // first: if we deleted the old asset before confirming the update
    // landed, a failed update would leave the project pointing at a URL
    // for an asset that no longer exists.
    const isCoverImageReplaced =
      data.coverImagePublicId &&
      existingProject.coverImagePublicId &&
      data.coverImagePublicId !== existingProject.coverImagePublicId;

    const removedGalleryPublicIds = data.gallery
      ? existingProject.gallery
          .filter(
            (oldItem) =>
              !data.gallery.some(
                (newItem) => newItem.publicId === oldItem.publicId,
              ),
          )
          .map((item) => item.publicId)
      : [];

    const updatedProject = await projectRepository.updateById(
      id,
      sanitizedData,
    );

    // Cleanup happens after the DB write succeeds, and failures here are
    // deliberately non-blocking (deleteCloudinaryAsset swallows its own
    // errors and logs them) — an orphaned asset is a lesser problem than
    // failing a successful project update over a Cloudinary hiccup.
    if (isCoverImageReplaced) {
      await deleteCloudinaryAsset(existingProject.coverImagePublicId);
    }
    for (const publicId of removedGalleryPublicIds) {
      await deleteCloudinaryAsset(publicId);
    }

    return updatedProject;
  },

  async deleteProject(id) {
    const existingProject = await projectRepository.findById(id);
    if (!existingProject) {
      throw new AppError("Project not found", 404, "NOT_FOUND");
    }

    await projectRepository.deleteById(id);

    // Same non-blocking cleanup principle as updateProject: the DB record
    // is already gone at this point, so a Cloudinary failure here only
    // means an orphaned asset, not an inconsistent database state.
    if (existingProject.coverImagePublicId) {
      await deleteCloudinaryAsset(existingProject.coverImagePublicId);
    }
    for (const item of existingProject.gallery) {
      await deleteCloudinaryAsset(item.publicId);
    }

    return existingProject;
  },
};
