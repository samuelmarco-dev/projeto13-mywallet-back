import joi from "joi";
import dayjs from "dayjs";

import db from '../mongoDB.js';

async function postIntroduceEntry(req, res){
    const date = dayjs().format('DD/MM');
    const { name, type, description, value, email } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    console.log('token no post', token);
    if(!token) return res.sendStatus(401);

    if(!name || Number(name) || name.includes('1', '2', '3', '4', '5', '6', '7', '8', '9', '0')){
        console.log('Nome com caracteres númericos, não serão aceitos');
        return res.sendStatus(422);
    }

    const schemaMensagem = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        type: joi.string().valid('entrada').required(),
        description: joi.string().required(),
        value: joi.number().required()
    });
    const validacao = schemaMensagem.validate({name, email, type, description, value}, {abortEarly: false});

    console.log('token', token);
    console.log('validação', validacao);

    if(validacao.error){
        console.log('A validação dos dados encontrou erro');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    try {
        if(validacao.value.value === 0) return res.sendStatus(401);
        const userSession = await db.collection('sessions').findOne({token});
        if(!userSession) return res.sendStatus(401);
        
        console.log('token encontrado em sessions', userSession);
        const usuarioExistente = await db.collection('users').findOne({_id: userSession.userId});

        console.log('usuario encontrado em users', usuarioExistente);
        if(usuarioExistente.email !== validacao.value.email) return res.sendStatus(401);

        if(usuarioExistente){
            console.log('usuário existe', usuarioExistente);
            
            const entradaJaExiste = await db.collection('wallet').findOne({name, token, date, description});
            if(!entradaJaExiste || entradaJaExiste.value !== value){
                console.log('entrada não existe ou valor é diferente', entradaJaExiste);
                const dados = await db.collection('wallet').insertOne({
                    name, type, description, value, date: dayjs().format('DD/MM'), token, email
                });
                delete dados.token;
    
                console.log('post entrada', dados);
                return res.send(dados).status(201);
            }
            if(entradaJaExiste){
                console.log('entrada ja existe', entradaJaExiste);
                return res.sendStatus(401);
            }
        }else{
            console.log('usuario não encontrado')
            res.sendStatus(401);
        }
    } catch (error) {
        console.log('catch conexão', error);
        res.sendStatus(500);
    }
}

async function postIntroduceExit(req, res){
    const date = dayjs().format('DD/MM');
    const { name, type, description, value, email } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    console.log('token no post', token);
    if(!token) return res.sendStatus(401);

    if(!name || Number(name) || name.includes('1', '2', '3', '4', '5', '6', '7', '8', '9', '0')){
        console.log('Nome com caracteres númericos, não serão aceitos');
        return res.sendStatus(422);
    }

    const schemaMensagem = joi.object({
        name: joi.string().required(),
        type: joi.string().valid('saida').required(),
        description: joi.string().required(),
        value: joi.number().required(),
        email: joi.string().email().required()
    });
    const validacao = schemaMensagem.validate({name, type, description, value, email}, {abortEarly: false});

    console.log('token', token);
    console.log('validação', validacao);

    if(validacao.error){
        console.log('A validação dos dados encontrou erro');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    try {
        if(validacao.value.value === 0) return res.sendStatus(401);
        const userSession = await db.collection('sessions').findOne({token});
        if(!userSession) return res.sendStatus(401);
    
        console.log('token encontrado em sessions', userSession);
        const usuarioExistente = await db.collection('users').findOne({_id: userSession.userId});

        console.log('usuario encontrado em users', usuarioExistente);
        if(usuarioExistente.email !== validacao.value.email) return res.sendStatus(401);

        if(usuarioExistente){
            console.log('usuário existe', usuarioExistente);

            const entradaJaExiste = await db.collection('wallet').findOne({name, token, date, description});
            if(!entradaJaExiste || entradaJaExiste.value !== value){
                console.log('entrada não existe ou valor é diferente', entradaJaExiste);
                const dados = await db.collection('wallet').insertOne({
                    name, type, description, value, date: dayjs().format('DD/MM'), token, email
                });
                delete dados.token;
    
                console.log('post entrada', dados);
                return res.send(dados).status(201);
            }
            if(entradaJaExiste){
                console.log('entrada ja existe', entradaJaExiste);
                return res.sendStatus(401);
            }
        }else{
            console.log('usuario não encontrado')
            res.sendStatus(401);
        }
    } catch (error) {
        console.log('catch conexão', error);
        res.sendStatus(500);
    }
}

export { postIntroduceEntry, postIntroduceExit };