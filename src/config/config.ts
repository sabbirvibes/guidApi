import { config as conf } from "dotenv";
conf();

const _config = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/guidApi",
  JWT_SECRET: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
