import joi from "joi";

const schemaEmail = joi.object({
    email: joi.string().email().required()
});

export default schemaEmail;