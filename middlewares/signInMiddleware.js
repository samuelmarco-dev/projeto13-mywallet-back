import schemaLogin from '../schemas/signInSchema.js';

export default function validateSchemaLogin(req, res, next) {
    const { email, password } = req.body;
    const validacao = schemaLogin.validate({email, password}, {abortEarly: false});
    console.log(validacao);

    if(validacao.error){
        console.log('A validação encontrou erro para fazer login');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }
    next();
}