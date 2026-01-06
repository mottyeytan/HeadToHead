import express from "express";
import { createServer } from "http";
import { initSocket } from "./socket/socketManager";
import chalk from "chalk";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

const io = initSocket(httpServer);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT,  () => {
  console.log(chalk.blue(`Server is running on port ${PORT}`));
  console.log(chalk.green(`Socket.io is ready`));
});