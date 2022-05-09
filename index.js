import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

import chalk from "chalk";

import { postSignInUser, postSignUpUser } from "./controllers/authController.js";
import { postIntroduceEntry, postIntroduceExit } from "./controllers/introduceController.js";
import { getWalletUser } from "./controllers/walletController.js";

const appServer = express();
appServer.use(cors());
appServer.use(json());
dotenv.config();

appServer.post('/sign-up', postSignUpUser);

appServer.post('/sign-in', postSignInUser); 

appServer.get('/wallet', getWalletUser);

appServer.post('/introduce-entry', postIntroduceEntry);

appServer.post('/introduce-exit', postIntroduceExit);

const port = process.env.PORT || 5000;
appServer.listen(port, ()=>{
    console.log(chalk.bold.green(`O serviço está disponível na porta ${port}`));
}); 
