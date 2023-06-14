import Joi from "joi";
import { errorResponse } from "../utils/api.response.js";

export async function validateCandidateRegistration(req, res, next) {
  try {
    const schema = Joi.object({
      firstname: Joi.string().required().label("firstname"),
      lastname: Joi.string().required().label("lastname"),
      nationalId: Joi.string().required().max(16).min(16).label("National ID"),
      profilePicture: Joi.string().required().label("Profile Picture"),
      gender: Joi.string().valid('MALE','FEMALE').required().label("Gender"),
      missionStatement: Joi.string().required().label("Mission statement")
    });

    const { error } = schema.validate(req.body);
    if (error) return errorResponse(error.message, res);

    return next();
  } catch (ex) {
    return errorResponse(ex.message, res);
  }
}