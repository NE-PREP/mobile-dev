import { compare, genSalt, hash } from "bcrypt";
import { User } from "../models/user.model.js";
import {
  createSuccessResponse,
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/api.response.js";
import _ from "lodash";
import { VoteCandidate } from "../models/VoteCandidate.model.js";

export const registerAsAdmin = async (req, res) => {
  try {
    let checkEmail = await User.findOne({ email: req.body.email });
    if (checkEmail) return errorResponse("Email is already registered!", res);

    let checkPhone = await User.findOne({ phone: req.body.phone });
    if (checkPhone)
      return errorResponse("Phone number is already registered!", res);

    let checkNationalId = await User.findOne({
      nationalId: req.body.nationalId,
    });
    if (checkNationalId)
      return errorResponse("National ID is already registered!", res);

    let user = new User(
      _.pick(req.body, [
        "firstname",
        "lastname",
        "nationalId",
        "email",
        "password",
        "phone",
      ])
    );

    user.role = "admin";

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);

    try {
      await user.save();
      return createSuccessResponse(
        "User registered successfully. You can now login",
        {},
        res
      );
    } catch (ex) {
      return errorResponse(ex.message, res);
    }
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const registerAsVoter = async (req, res) => {
  try {
    let checkEmail = await User.findOne({ email: req.body.email });
    if (checkEmail) return errorResponse("Email is already registered!", res);

    let checkPhone = await User.findOne({ phone: req.body.phone });
    if (checkPhone)
      return errorResponse("Phone number is already registered!", res);

    let checkNationalId = await User.findOne({
      nationalId: req.body.nationalId,
    });
    if (checkNationalId)
      return errorResponse("National ID is already registered!", res);

    let user = new User(
      _.pick(req.body, [
        "firstname",
        "lastname",
        "nationalId",
        "email",
        "password",
        "phone",
      ])
    );

    user.role = "voter";

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);

    try {
      await user.save();
      return createSuccessResponse(
        "User registered successfully. You can now login",
        {},
        res
      );
    } catch (ex) {
      return errorResponse(ex.message, res);
    }
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).select("_id role password");
    if (!user) return errorResponse("Invalid email or password!", res);

    const validPassword = await compare(req.body.password, user.password);
    if (!validPassword) return errorResponse("Invalid email or password!", res);

    const token = user.generateAuthToken();

    return successResponse("Login successful!", { access_token: token }, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const getProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) return errorResponse("User not found!", res);

    return successResponse("Profile", user, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const checkIfUserVoted = async (req, res) => {
  try {
    const { _id } = req.user;
    let checkIfUserVoted = await VoteCandidate.findOne({ voter: _id });
    if (!checkIfUserVoted)
      return successResponse("Has user voted?", { voted: false }, res);
    return successResponse("Has user voted?", { voted: true }, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};
