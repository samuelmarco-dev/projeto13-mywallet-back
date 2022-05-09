import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

import chalk from "chalk";

import signRouter from "./routes/authRouter.js";
import introduceRouter from "./routes/introduceRouter.js";
import walletRouter from "./routes/walletRouter.js";

const appServer = express();
appServer.use(cors());
appServer.use(json());
dotenv.config();

appServer.use(signRouter);
appServer.use(walletRouter);
appServer.use(introduceRouter);

const port = process.env.PORT || 5000;
appServer.listen(port, ()=>{
    console.log(chalk.bold.green(`O serviço está disponível na porta ${port}`));
}); 
