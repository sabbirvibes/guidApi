import express from "express";
import { registerUser } from "../controllers/authControllers";
const authRouter = express.Router();
// Define authentication routes here
authRouter.post("/register", registerUser);

export default authRouter;
