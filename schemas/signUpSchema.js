import joi from 'joi';

const regex = /^[a-zA-zçÇ]{3,12}[0-9]{4,8}$/;

const schemaCadastro = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(regex).required()
});

export default schemaCadastro;