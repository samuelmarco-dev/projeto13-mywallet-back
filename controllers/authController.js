import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import db from '../mongoDB.js';

async function postSignUpUser(req, res) {
    const { name, email, password } = req.body;
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