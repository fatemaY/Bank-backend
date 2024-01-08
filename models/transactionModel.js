import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
  client_id: {
    type: mongoose.Schema.Types.Number,
    required: true,
    ref: "Account",
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Account",
  },
  transaction_date: {
    type: Date,
    timestamp: true,
  },
  transaction_amount: {
    type: Number,
  },
  transaction_type: {
    type: String,
    enum: ["withdrawal", "transfer"],
    required: true,
  },
  transfer_from: {
    type: String,
  },
  transfer_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  balance: {
    type: Number,
  },
},
{
  timestamps: true,
}
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
