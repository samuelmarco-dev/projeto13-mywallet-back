import joi from 'joi';

const regex = /^[a-zA-zçÇ]{3,12}[0-9]{4,8}$/;

const schemaLogin = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(regex).required()
});

export default schemaLogin;