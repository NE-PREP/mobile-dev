import mongoose from "mongoose";
const { Schema, model } = mongoose;

const voteCandidateSchema = new Schema(
  {
    candidate: {
      type: String,
      required: true,
      ref: "candidate",
    },
    voter: {
      type: String,
      required: true,
      ref: "user",
    }
  },
  { timestamps: true }
);

export const VoteCandidate = model("voteCandidate", voteCandidateSchema);
