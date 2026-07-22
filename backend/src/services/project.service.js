import { projectRepository } from "../repositories/project.repository.js";
import { slugify } from "../utils/slugify.js";
import { sanitizeRichText } from "../utils/sanitizeHtml.js";
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

    return projectRepository.updateById(id, sanitizedData);
  },

  async deleteProject(id) {
    const deleted = await projectRepository.deleteById(id);
    if (!deleted) {
      throw new AppError("Project not found", 404, "NOT_FOUND");
    }
    return deleted;
  },
};
