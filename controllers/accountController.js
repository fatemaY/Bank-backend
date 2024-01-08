import STATUS_CODE from "../constants/statusCodes.js";
import Account from "../models/accountModel.js";


// @desc Get all accounts
// @route GET /api/accounts/get-all-accounts
// @access Public
export const getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find({});
    res.status(200).json(accounts);
  } catch (error) {
    next(error);
  }
};

// @desc all accounts for a user
// @route GET /api/accounts/get-accounts
// @access Private
export const getAccountById = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id)
    if(!account){
        res.status(STATUS_CODE.NOT_FOUND)
        throw new Error("No such account in the database")
    }
    res.send(account);
  } catch (error) {
    next(error);
  }
};


// @desc Create a new account
// @route POST /api/accounts/create-account
// @access Private
export const createAccount = async (req, res, next) => {
    try {
      const {client_id, name, initial_balance} = req.body;
      // const accountExists = await Account.findOne({ client_id })
      // if (accountExists) {
      //   res.status(400);
      //   throw new Error("Account already exists");
      // }
      const account = await Account.create({
        client_id,
        name,
        initial_balance,
      });
      res.status(201).json({ message: "Account created successfully", account });
    } catch (error) {
      next(error);
    }
  };


// @desc Delete account by id
// @route DELETE /api/accounts/delete-account/:id
// @access Private
export const deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      res.status(400);
      throw new Error("Account not found");
    }
    await Account.deleteOne({ _id: account._id });
    res.status(STATUS_CODE.OK).send(`Account with the id of ${req.params.id} was deleted!`);
  } catch (error) {
    next(error);
  }
}



export const filter = async (req, res, next) => {
  try {
      let { filterType, min, max } = req.query;
      if (isNaN(min)) min = 0;
      if (isNaN(max)) max = Number.MAX_SAFE_INTEGER;
      let filteredUsers;
      if (filterType==="balance") {
              const accounts = await Account.find();
              filteredUsers = accounts.filter(
                  (account) =>
                      account.initial_balance >= min &&
                      account.initial_balance <= max
              );
      }
              // filteredUsers = User.find({
              //     $expr: {
              //         $and: [
              //             { $gte: [{ $add: ["$cash", "$credit"] }, min] },
              //             { $lte: [{ $add: ["$cash", "$credit"] }, max] },
              //         ],
              //     },
              // });
          //     break;
          // case "cash":
          //     filteredUsers = await User.find({ isActive: true })
          //         .where("cash")
          //         .gte(min)
          //         .lte(max);
          //     break;
          // case "credit":
          //     filteredUsers = await User.find({ isActive: true })
          //         .where("credit")
          //         .gte(min)
          //         .lte(max);
          //     break;
          else{

              res.status(STATUS_CODE.BAD_REQUEST);
              throw new Error("No such filter");
          }
          res.send(filteredUsers);

      
  } catch (error) {
      next(error);
  }
};