import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    client_id: {
      type: String,
      require: [true, "please provide client id"],
      unique : true,
      min: 9,
      max: 9
    },
    name: {
      type: String,
      required: [true, "Please fill the information"],
    },

    initial_balance: {
      type: Number,
      require: [true, "please provide initial balance"],
      min: [500, "Initial Balance Can Not less Than 500L.E"],
    },
  },
  {
    timestamps: true,
  }
);


const Account = mongoose.model("Account", accountSchema);

export default Account;
