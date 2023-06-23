import mongoose from "mongoose";
const { Schema, model } = mongoose;

const purchasedTokensSchema = new Schema({
  meter_number: {
    type: String,
    length: 6,
    required: true
  },
  token: {
    type: String,
    length: 8,
    unique: true,
    required: true
  },
  token_status: {
    type: String,
    enum: ["USED", "NEW", "EXPIRED"],
    required: true
  },
  token_value_days: {
    type: Number,
    length: 11,
    required: true
  },
  purchased_date: {
    type: Date,
    default: new Date(),
    required: true
  },
  amount: {
    type: Number,
    length: 11,
    required: true
  }
});

export const PurchasedToken = model("purchased_tokens", purchasedTokensSchema);
