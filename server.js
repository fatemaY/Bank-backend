import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import accountRoutes from "./routes/accountRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors()); // Solving cors

app.use(express.json()); // Body parser middleware

// accounts Routes - 
app.use("/api/v1/accounts", accountRoutes);


// transactions routes - c
app.use("/api/v1/transactions", transactionsRoutes);

app.use(errorHandler); // Error handler middleware

const PORT = process.env.PORT || 5000; // takes port from .env or just put 5000

connectDB().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
})
