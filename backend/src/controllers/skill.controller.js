import { skillService } from "../services/skill.service.js";
import { success } from "../utils/responseEnvelope.js";

export const skillController = {
  async getAllSkills(req, res) {
    const skills = await skillService.getAllSkills();
    return success(res, { data: skills, message: "Skills retrieved" });
  },

  async createSkill(req, res) {
    const skill = await skillService.createSkill(req.body);
    return success(res, {
      data: skill,
      message: "Skill created",
      statusCode: 201,
    });
  },

  async updateSkill(req, res) {
    const skill = await skillService.updateSkill(req.params.id, req.body);
    return success(res, { data: skill, message: "Skill updated" });
  },

  async deleteSkill(req, res) {
    const force = req.query.force === "true";
    await skillService.deleteSkill(req.params.id, { force });
    return success(res, { data: null, message: "Skill deleted" });
  },
};
