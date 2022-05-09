import { MongoClient } from 'mongodb';
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

let db = null;

const mongoClient = new MongoClient(process.env.MONGO_URL); //conexão no banco mongoDB

try {
    await mongoClient.connect(); //tentando conexão 
    db = mongoClient.db(process.env.BANCO); //pela conexão, acessar o banco de dados da aplicação
    console.log(chalk.bold.green('A conexão com o banco de dados foi estabelecida'));    
} catch (e) {
    console.log(chalk.bold.red("Erro ao se conectar ao banco de dados", e));
}

export default db;