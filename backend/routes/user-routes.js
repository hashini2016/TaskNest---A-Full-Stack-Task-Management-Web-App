import express from "express";
import { signup, login } from "../controllers/authController.js";
import { forgotPassword } from "../controllers/user-controller.js";


const router = express.Router();

router.post("/signup", signup); 
router.post("/login", login); 
router.put("/forgot-password", forgotPassword);


export default router;
