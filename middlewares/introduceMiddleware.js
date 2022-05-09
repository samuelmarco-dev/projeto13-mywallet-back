import { schemaEntrada, schemaSaida } from '../schemas/introduceSchema.js';

function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    console.log('token no post', token);

    if(!token) return res.sendStatus(401);

    res.locals.token = token;
    next();
}

function validateName(req, res, next) {
    const { name } = req.body;

    if(!name || Number(name) || name.includes('1', '2', '3', '4', '5', '6', '7', '8', '9', '0')){
        console.log('Nome com caracteres númericos, não serão aceitos');
        return res.sendStatus(422);
    }
    next();
}

function validateSchemaUserEntry(req, res, next) {
    const { name, type, description, value, email } = req.body;
    const validacao = schemaEntrada.validate({name, type, description, value, email}, {abortEarly: false});
    console.log('validação', validacao);

    if(validacao.error){
        console.log('A validação dos dados encontrou erro');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    res.locals.validacao = validacao;
    next();
}

function validateSchemaUserExit(req, res, next) {
    const { name, type, description, value, email } = req.body;
    const validacao = schemaSaida.validate({name, type, description, value, email}, {abortEarly: false});
    console.log('validação', validacao);

    if(validacao.error){
        console.log('A validação dos dados encontrou erro');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }

    res.locals.validacao = validacao;
    next();
}

export { validateToken, validateName, validateSchemaUserEntry, validateSchemaUserExit };