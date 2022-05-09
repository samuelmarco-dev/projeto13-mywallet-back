import db from '../mongoDB.js';

async function getWalletUser(req, res){
    const { email } = req.headers;
    const { token } = res.locals;
    const { validacao } = res.locals;
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