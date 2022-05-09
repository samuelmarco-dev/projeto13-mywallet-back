import joi from "joi";

import db from '../mongoDB.js';

async function getWalletUser(req, res){
    const { email } = req.headers;
    const { authorization } = req.headers;
    console.log(authorization, email);

    const token = authorization?.replace('Bearer', '').trim();
    console.log('token no get', token);
    if(!token || !email) return res.sendStatus(401);
    
    const schemaEmail = joi.object({
        email: joi.string().email().required()
    });
    const validacao = schemaEmail.validate({email}, {abortEarly: false});

    if(validacao.error){
        console.log('A validação encontrou erro para fazer get com este email');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    try {
        console.log('bloco try/catch no get com token...')
        const userSession = await db.collection('sessions').findOne({token});
        if(!userSession) return res.sendStatus(401);
        
        console.log('usuario encontrado em sessions', userSession);
        const usuarioExistente = await db.collection('users').findOne({_id: userSession.userId});
        
        console.log('usuario encontrado em users', usuarioExistente);
        if(usuarioExistente.email !== validacao.value.email) return res.sendStatus(401);

        if(usuarioExistente){
            console.log('usuario encontrado em user', usuarioExistente);
            const dadosUsuarios = await db.collection('wallet').find({email}).toArray();
            console.log("find", dadosUsuarios);

            dadosUsuarios.map(item => delete item.token);
            console.log('dados usuário', dadosUsuarios);
    
            return res.status(200).send(dadosUsuarios);
        }else{
            console.log('usuario não encontrado')
            res.sendStatus(401);
        }
    } catch (error) {
        console.log('catch conexão', error);
        res.sendStatus(500);
    }
}

export { getWalletUser };