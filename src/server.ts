import app from "./app";
import { config } from "./config/config";

const server = () => {
  app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });
};
server();
