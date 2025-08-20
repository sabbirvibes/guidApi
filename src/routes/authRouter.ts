import express from "express";
import {
  loginUser,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/authControllers";
const authRouter = express.Router();
// Define authentication routes here
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh", refreshToken);
authRouter.post("/logout", logout);

export default authRouter;
