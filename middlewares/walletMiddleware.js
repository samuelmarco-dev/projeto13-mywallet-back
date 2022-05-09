import schemaEmail from '../schemas/walletSchema.js';

function validateToken(req, res, next) {
    const { email } = req.headers;
    const { authorization } = req.headers;
    console.log(authorization, email);

    const token = authorization?.replace('Bearer', '').trim();
    console.log('token no get', token);
    if(!token || !email) return res.sendStatus(401);

    res.locals.token = token;
    next();
}

function validateSchemaUser(req, res, next) {
    const { email } = req.headers;
    const validacao = schemaEmail.validate({email}, {abortEarly: false});
    console.log(validacao);

    if(validacao.error){
        console.log('A validação encontrou erro para fazer get com este email');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    res.locals.validacao = validacao;
    next();
}

export { validateToken, validateSchemaUser };