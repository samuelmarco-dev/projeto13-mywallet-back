import joi from "joi";

const schemaEntrada = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    type: joi.string().valid('entrada').required(),
    description: joi.string().required(),
    value: joi.number().required()
});

const schemaSaida = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    type: joi.string().valid('saida').required(),
    description: joi.string().required(),
    value: joi.number().required()
});

export { schemaEntrada, schemaSaida };