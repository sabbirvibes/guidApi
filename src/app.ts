import express from "express";

const app = express();

// Middleware
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import apiRouter from "./routes/api";
import GlobalErrorHandler from "./middlewares/GlobalErrorHandler";

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 60 })); // Limit each IP to 100 requests per windowMs
app.use(helmet());
app.use(hpp()); // Prevent HTTP Parameter Pollution
// Cache
app.set("etag", false);

app.use(apiRouter);

// Global error handler
app.use(GlobalErrorHandler);

export default app;
