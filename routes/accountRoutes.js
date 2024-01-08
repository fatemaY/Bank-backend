import express from "express";
import { createAccount, deleteAccount, filter, getAccountById, getAllAccounts } from "../controllers/accountController.js";

const router = express.Router();

router.get("/get-all-accounts", getAllAccounts);

router.get("/get-account/:id", getAccountById);

router.post("/create-account", createAccount);

router.delete("/delete-account/:id", deleteAccount);

router.get("/filter/by", filter);


export default router;
