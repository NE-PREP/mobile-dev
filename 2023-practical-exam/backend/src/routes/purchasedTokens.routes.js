import express from 'express'
import { getTokensByMeterNumber, purchaseAToken, validateAToken } from '../controllers/purchasedTokens.controller.js'
import { validateTokenPurchasing } from '../validators/purchasedTokens.validator.js'
const router = express.Router()

router.get("/validate/:token", validateAToken)

router.get("/by-meter-number/:meter_number", getTokensByMeterNumber)

router.post("/new",validateTokenPurchasing,purchaseAToken)

export default router;