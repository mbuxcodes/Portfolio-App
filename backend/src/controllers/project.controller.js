import { projectService } from "../services/project.service.js";
import { success } from "../utils/responseEnvelope.js";

export const projectController = {
  async getPublishedProjects(req, res) {
    const { category, tech } = req.query;
    const projects = await projectService.getPublishedProjects({
      category,
      tech,
    });
    return success(res, { data: projects, message: "Projects retrieved" });
  },

  async getPublishedProjectBySlug(req, res) {
    const project = await projectService.getPublishedProjectBySlug(
      req.params.slug,
    );
    return success(res, { data: project, message: "Project retrieved" });
  },

  async getAllProjectsForAdmin(req, res) {
    const { category, status } = req.query;
    const projects = await projectService.getAllProjectsForAdmin({
      category,
      status,
    });
    return success(res, { data: projects, message: "Projects retrieved" });
  },

  async createProject(req, res) {
    const project = await projectService.createProject(req.body);
    return success(res, {
      data: project,
      message: "Project created",
      statusCode: 201,
    });
  },

  async updateProject(req, res) {
    const project = await projectService.updateProject(req.params.id, req.body);
    return success(res, { data: project, message: "Project updated" });
  },

  async deleteProject(req, res) {
    await projectService.deleteProject(req.params.id);
    return success(res, { data: null, message: "Project deleted" });
  },
};
