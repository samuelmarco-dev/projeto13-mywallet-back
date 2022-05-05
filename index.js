import express, { json } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import dayjs from "dayjs";

import chalk from "chalk";

const appServer = express();
appServer.use(cors());
appServer.use(json());
dotenv.config();

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URL); //conexão no banco mongoDB
const promise = mongoClient.connect(); //tentando conexão 
promise.then(()=>{
    db = mongoClient.db(process.env.BANCO); //pela conexão, acessar o banco de dados da aplicação
    console.log(chalk.bold.green('A conexão com o banco de dados foi estabelecida'));
}).catch((e)=>{
    console.log(chalk.bold.red("Erro ao se conectar ao banco de dados", e));
});

//TODO: rota de cadastro
appServer.post('/sign-up', async (req, res)=>{
    const {name, email, password} = req.body;
    const regex = /^[a-zA-zçÇ]{3,12}[0-9]{4,8}$/;

    if(Number(name) || name.includes('1', '2', '3', '4', '5', '6', '7', '8', '9', '0')){
        console.log('Nome com caracteres númericos, não são aceitos');
        return res.sendStatus(422);
    }

    const schemaCadastro = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(regex).required()
    });
    const validacao = schemaCadastro.validate({name, email, password}, {abortEarly: false});
    console.log(validacao);
    
    if(validacao.error){
        console.log('Todos os dados são obrigatórios');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    try {
        const usuarioExistente = await db.collection('users').findOne({email});
        if(usuarioExistente) {
            console.log('Usuário já existe no banco de dados');
            return res.sendStatus(409);
        }

        const senhaCriptografada = bcrypt.hashSync(password, 10);
        await db.collection('users').insertOne({name, email, password: senhaCriptografada});
        return res.sendStatus(201);
    } catch (error) {
        console.log('catch conexão', error);
        res.sendStatus(500);
    }
});

//TODO: rota de login
appServer.post('sign-in', async (req, res)=>{
    const { email, password } = req.body;

    try {
        const usuarioExistente = await db.collection('users').findOne({email});
        if(usuarioExistente && !(bcrypt.compareSync(password, usuarioExistente.password))){
            console.log('Senha incorreta');
            return res.status(403).send('Senha incorreta');
        }

        if(usuarioExistente && bcrypt.compareSync(password, usuarioExistente.password)){
            console.log('usuário e senha deram match');
            
            const token = uuid();
            await db.collection('sessions').insertOne({userId: usuarioExistente.id, token});
            return res.sendStatus(token);
        }else{
            console.log('usuario e senha não deram match');
            return res.sendStatus(401);
        }
    } catch (error) {
        console.log('catch conexão', error);
        res.sendStatus(500);
    }   
});

//TODO: rota de buscar dados
appServer.get('/wallet', async (req, res)=>{
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    if(!token) return res.sendStatus(401);

    const userSession = await db.collection('sessions').findOne({token});
    if(!userSession) return res.sendStatus(401);

    const usuarioExistente = await db.collection('users').findOne({_id: userSession.userId});
    
    if(usuarioExistente){
        const dadosUsuarios = await db.collection('wallet').find({token}).toArray();
        delete dadosUsuarios.token;

        return res.status(200).send(dadosUsuarios);
    }else{
        console.log('usuario não encontrado')
        res.sendStatus(401);
    }
});

//TODO: rota para postar dados como 'entrada' de receitas
appServer.post('/introduce-entry', async (req, res)=>{
    const { name, type, description, value } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    if(!token) return res.sendStatus(401);

    const schemaMensagem = joi.object({
        name: joi.string().required(),
        type: joi.string().valid('entrada').required(),
        description: joi.string().required(),
        value: joi.number().required()
    });
    const validacao = schemaMensagem.validate({name, type, description, value}, {abortEarly: false});

    if(validacao.error){
        console.log('A validação dos dados encontrou erro');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    try {
        const userSession = await db.collection('sessions').findOne({token});
        if(!userSession) return res.sendStatus(401);
    
        const usuarioExistente = await db.collection('users').findOne({_id: userSession.userId});
        if(usuarioExistente){
            const dados = await db.collection('wallet').insertOne({
                name, type, description, value, date: dayjs().format('DD/MM'), token
            });
    
            delete dados.token;
            return res.send(dados).status(201);
        }else{
            console.log('usuario não encontrado')
            res.sendStatus(401);
        }
    } catch (error) {
        console.log('catch conexão', error);
        res.sendStatus(500);
    }
});

appServer.post('/introduce-exit', async (req, res)=>{
    const { name, type, description, value } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    if(!token) return res.sendStatus(401);

    const schemaMensagem = joi.object({
        name: joi.string().required(),
        type: joi.string().valid('saída').required(),
        description: joi.string().required(),
        value: joi.number().required()
    });
    const validacao = schemaMensagem.validate({name, type, description, value}, {abortEarly: false});

    if(validacao.error){
        console.log('A validação dos dados encontrou erro');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    try {
        const userSession = await db.collection('sessions').findOne({token});
        if(!userSession) return res.sendStatus(401);
    
        const usuarioExistente = await db.collection('users').findOne({_id: userSession.userId});
        if(usuarioExistente){
            const dados = await db.collection('wallet').insertOne({
                name, type, description, value, date: dayjs().format('DD/MM'), token
            });
    
            delete dados.token;
            return res.send(dados).status(201);
        }else{
            console.log('usuario não encontrado')
            res.sendStatus(401);
        }
    } catch (error) {
        console.log('catch conexão', error);
        res.sendStatus(500);
    }
});

const port = process.env.PORT || 5000;
appServer.listen(port, ()=>{
    console.log(chalk.bold.green(`O serviço está disponível na porta ${port}`));
});
