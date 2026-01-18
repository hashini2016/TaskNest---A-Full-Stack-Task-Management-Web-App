import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user-routes.js";
import taskRouter from "./routes/task-routes.js"


import dotenv from "dotenv";
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);


const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "your_mongodb_connection_string_here";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to MongoDB`);
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
