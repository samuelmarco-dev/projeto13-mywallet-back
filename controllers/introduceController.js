import dayjs from "dayjs";

import db from '../mongoDB.js';

async function postIntroduceEntry(req, res){
    const date = dayjs().format('DD/MM');
    const { name, type, description, value, email } = req.body;
    const { token } = res.locals;
    const { validacao } = res.locals;
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
    const { token } = res.locals;
    const { validacao } = res.locals;
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