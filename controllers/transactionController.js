import STATUS_CODE from '../constants/statusCodes.js'
import Account from '../models/accountModel.js';
import Transaction from '../models/transactionModel.js';


// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async(req, res, next)=>{
    try {
      const { account_id, transaction_amount, transaction_type, transfer_to } = req.body;
      const account = await Account.findById(account_id);


      if (transaction_amount <= 0) {
      res.status(400);
      throw new Error("Transaction amount must be greater than 0");
    }
    if (transaction_type !== "withdrawal" && transaction_type !== "transfer") {
      res.status(400);
      throw new Error("Transaction type must be withdrawal or transfer");
    }
    if (account) {
      if (transaction_type === "withdrawal") {
        account.initial_balance = parseInt(account.initial_balance) - parseInt(transaction_amount);
        await account.save();
        if (account.initial_balance < 0) {
          res.status(STATUS_CODE.CONFLICT);
          throw new Error("You don't have enough balance to withdraw");
        }
      } else if (transaction_type === "transfer") {
        account.initial_balance = parseInt(account.initial_balance) - parseInt(transaction_amount);

        await account.save();
        if (account.initial_balance < 0) {
          res.status(STATUS_CODE.CONFLICT);
          throw new Error("You don't have enough balance to withdraw");
        }
        if(transfer_to){
        const transferToAccount = await Account.findById(transfer_to);
        if (transferToAccount) {
          transferToAccount.initial_balance = parseInt(transferToAccount.initial_balance) + parseInt(transaction_amount);
          await transferToAccount.save();
        } else {
          res.status(STATUS_CODE.NOT_FOUND)
          throw new Error("Account not found");
        }
      }
    }

      const transaction = await Transaction.create({
        client_id: account.client_id,
        account_id:account.id,
        transaction_amount,
        transaction_type,
        transfer_to: transfer_to,
        balance: account.initial_balance,
      })

      await transaction.save();
      res.status(STATUS_CODE.CREATED).json(transaction);

      } else {
         res.status(STATUS_CODE.NOT_FOUND);
         throw new Error("Account not found");
        }
      } catch (error) {
        next(error)
      }
}


export const getAllTransaction = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({});
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};







// get all transactions for a user
// GET /api/transactions/get-transactions/:clientId
// @access  Private
export const getTransactionsByid = async(req, res, next)=>{
  try{
  // show all the transactions by user and also account _id informations from account table
  const transactions = await Transaction.findById(req.params.clientId)
    .populate({
      path: "account_id",
      select: "name",
      model: Account,
      options: { strictPopulate: false },
    })
    .populate({
      path: "transfer_to",
      select: "name",
      model: Account,
      options: { strictPopulate: false },
    });
    if(transactions){
      res.json(transactions);
    }else {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("Transactions not found");
  }
  } catch (error) {
    next(error)
  }
}





export const filterByType = async (req, res, next) => {
  try {
      let { filterType} = req.query;
      let filteredUsers;
      if (filterType==="withdrawl") {
              const transactions = await Transaction.find();
              filteredUsers = transactions.filter(
                  (transaction) =>
                  transaction.transaction_type ==="withdrawal"
              );
      }
      if (filterType==="transfer") {
        const transactions = await Transaction.find();
        filteredUsers = transactions.filter(
            (transaction) =>
            transaction.transaction_type ==="transfer"
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