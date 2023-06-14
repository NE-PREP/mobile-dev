import { User } from "../models/user.model.js";
import {
  createSuccessResponse,
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/api.response.js";
import _ from "lodash";
import { Candidate } from "../models/candidate.model.js";
import { VoteCandidate } from "../models/VoteCandidate.model.js";

export const getAllCandidatesAsAnAdmin = async (req, res) => {
  try {
    let candidates = await Candidate.find();

    var returnCandidatesArray = [];

    for(const candidate of candidates){
      let candidateObject = {
        candidate: {},
        votes: 0,
      };
      candidateObject.votes = await getVotesOfACandidate(candidate._id);
      candidateObject.candidate = candidate;
      returnCandidatesArray.push(candidateObject);
    }

    return successResponse("Candidates", returnCandidatesArray, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

const getVotesOfACandidate = async (candidateId) => {
  let votes = await VoteCandidate.find({
    candidate: candidateId,
  }).countDocuments();
  return votes;
};

export const getAllCandidatesAsAVoter = async (req, res) => {
  try {
    let { _id } = req.user;

    let candidates = await Candidate.find();

    let checkIfUserVoted = await VoteCandidate.findOne({ voter: _id });

    let returnCandidatesArray = [];

    for(const candidate of candidates){
      let candidateObject = {
        candidate: {},
        votes: null,
      };
      checkIfUserVoted && (candidateObject.votes = await getVotesOfACandidate(candidate._id))
      candidateObject.candidate = candidate;
      returnCandidatesArray.push(candidateObject);
    }

    return successResponse("Candidates", returnCandidatesArray, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const registerCandidate = async (req, res) => {
  try {
    let checkNationalId = await User.findOne({
      nationalId: req.body.nationalId,
    });
    if (checkNationalId)
      return errorResponse("National ID is already registered!", res);

    let candidate = new Candidate(
      _.pick(req.body, [
        "firstname",
        "lastname",
        "nationalId",
        "profilePicture",
        "gender",
        "missionStatement",
      ])
    );

    try {
      await candidate.save();
      return createSuccessResponse(
        "Candidate registered successfully",
        candidate,
        res
      );
    } catch (ex) {
      return errorResponse(ex.message, res);
    }
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const voteACandidate = async (req, res) => {
  try {
    const { _id } = req.user;
    const { candidateId } = req.body;

    let checkIfUserVoted = await VoteCandidate.findOne({ voter: _id });
    if (checkIfUserVoted) return errorResponse("User has already voted!", res);

    let findCandidate = await Candidate.findById(candidateId);
    if (!findCandidate)
      return notFoundResponse("id", candidateId, "Candidate", res);

    let newVote = new VoteCandidate({
      voter: _id,
      candidate: candidateId,
    });

    await newVote.save();

    return successResponse("You voted the candidate successfully", {}, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};
