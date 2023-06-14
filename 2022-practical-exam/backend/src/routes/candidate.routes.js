import express from 'express'
import authenticate from '../middlewares/auth.middleware.js'
import voter from '../middlewares/voter.middleware.js'
import admin from '../middlewares/admin.middleware.js'
import { getAllCandidatesAsAVoter, getAllCandidatesAsAnAdmin, registerCandidate, voteACandidate } from '../controllers/candidate.controller.js'
import { validateCandidateRegistration } from '../validators/candidate.validator.js'
const router = express.Router()

router.get("/as-voter", authenticate, voter, getAllCandidatesAsAVoter)

router.get("/as-admin", authenticate, admin, getAllCandidatesAsAnAdmin)

router.post("/register",authenticate,admin,validateCandidateRegistration,registerCandidate)

router.post("/vote",authenticate,voter,voteACandidate)

export default router;