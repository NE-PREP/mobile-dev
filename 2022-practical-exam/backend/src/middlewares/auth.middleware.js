import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/api.response.js";
const { verify } = jwt;

export default function (req, res, next) {
  if (!req.header("auth-token"))
    return res.status(401).send("Access denied! you must be logged in");

  var token = req.header("auth-token").trim();

  if (!token)
    return res.status(401).send("Access denied! you must be logged in");
  try {
    token = token.replace("Bearer", "").trim();
    let user = verify(token, process.env.JWT.trim());
    req.user = user;
    next();
  } catch (ex) {
    return errorResponse("Invalid token!", res);
  }
}
