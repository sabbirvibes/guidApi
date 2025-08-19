import app from "./app";
import { config } from "./config/config";
import connectDB from "./config/db";

const server = async () => {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });
};
server();
