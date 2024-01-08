import express from "express";
import { createTransaction,  filterByType, getAllTransaction, getTransactionsByid } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/create-transaction", createTransaction);

router.get("/get-transactions/:clientId", getTransactionsByid);

router.get("/get-transactions", getAllTransaction);

router.get("/filterByType", filterByType);


export default router;
