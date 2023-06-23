import Joi from "joi";
import { errorResponse } from "../utils/api.response.js";

export async function validateTokenPurchasing(req, res, next) {
  try {
    const schema = Joi.object({
      amount: Joi.number().min(3).required().label("Amount"),
      meter_number: Joi.string().min(6).required().label("Meter number"),
    });

    const { error } = schema.validate(req.body);
    if (error) return errorResponse(error.message, res);

    return next();
  } catch (ex) {
    return errorResponse(ex.message, res);
  }
}