import schemaCadastro from "../schemas/signUpSchema.js";

function validateName(req, res, next) {
    const { name } = req.body;
    const regexName = /^[a-zA-ZáéíóúàâêôãõüçÁÉÍÓÚÀÂÊÔÃÕÜÇ ]+$/;

    if(!name || Number(name) || !regexName.test(name)){
        console.log('Nome com caracteres númericos, não serão aceitos');
        return res.status(400).send('Nome com caracteres númericos, não serão aceitos');
    }
    next();
}

function validateSchemaCadastro(req, res, next) {
    const { name, email, password } = req.body;
    const validacao = schemaCadastro.validate({name, email, password}, {abortEarly: false});
    console.log(validacao);

    if(validacao.error){
        console.log('Todos os dados são obrigatórios. A validação encontrou erro');
        return res.status(422).send(validacao.error.details.map(err=>err.message));
    }
    next();
}

export { validateName, validateSchemaCadastro };