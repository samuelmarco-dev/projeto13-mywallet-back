import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import db from '../mongoDB.js';

async function postSignUpUser(req, res) {
    const { name, email, password } = req.body;
    const regex = /^[a-zA-zçÇ]{3,12}[0-9]{4,8}$/;
    const regexName = /^[a-zA-ZáéíóúàâêôãõüçÁÉÍÓÚÀÂÊÔÃÕÜÇ ]+$/;
    console.log(regexName.test(name));

    if(!name || Number(name) || !regexName.test(name)){
        console.log('Nome com caracteres númericos, não serão aceitos');
        return res.status(400).send('Nome com caracteres númericos, não serão aceitos');
    }

    const schemaCadastro = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(regex).required()
    });
    const validacao = schemaCadastro.validate({name, email, password}, {abortEarly: false});
    console.log(validacao);
    
    if(validacao.error){
        console.log('Todos os dados são obrigatórios. A validação encontrou erro');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    try {
        const usuarioExistente = await db.collection('users').findOne({email});
        if(usuarioExistente) {
            console.log('Usuário já existe no banco de dados');
            return res.sendStatus(409);
        }

        console.log('usário pode ser cadastrado');
        const senhaCriptografada = bcrypt.hashSync(password, 10);
        await db.collection('users').insertOne({name, email, password: senhaCriptografada});

        console.log('usuário cadastrado', name, email, senhaCriptografada);
        return res.sendStatus(201);
    } catch (error) {
        console.log('catch conexão', error);
        res.sendStatus(500);
    }
}

async function postSignInUser(req, res) {
    const { email, password } = req.body;
    const regex = /^[a-zA-zçÇ]{3,12}[0-9]{4,8}$/;

    const schemaLogin = joi.object({
        email: joi.string().email().required(),
        password: joi.string().pattern(regex).required()
    });
    const validacao = schemaLogin.validate({email, password}, {abortEarly: false});
    console.log(validacao);
    
    if(validacao.error){
        console.log('A validação encontrou erro para fazer login');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    try {
        const usuarioExistente = await db.collection('users').findOne({email});
        if(usuarioExistente && !(bcrypt.compareSync(password, usuarioExistente.password))){
            console.log('Senha incorreta');
            return res.status(403).send('Senha incorreta');
        }

        if(usuarioExistente && bcrypt.compareSync(password, usuarioExistente.password)){
            console.log('usuário e senha deram match');
            
            const token = uuid();
            await db.collection('sessions').insertOne({userId: usuarioExistente._id, token});

            const informacao = {token, name: usuarioExistente.name};
            console.log('token gerado', informacao);
            return res.send(informacao).status(200);
        }else{
            console.log('usuario e senha não deram match');
            return res.sendStatus(401);
        }
    } catch (error) {
        console.log('catch conexão', error);
        res.sendStatus(500);
    }
}

export { postSignUpUser, postSignInUser };