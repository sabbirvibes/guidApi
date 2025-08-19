import express from "express";
import authRouter from "./authRouter";

const apiRouter = express.Router();

// Authentication routes
apiRouter.use("/api/v1/auth", authRouter);
export default apiRouter;
