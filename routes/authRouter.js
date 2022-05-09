import { Router } from 'express';

import { postSignUpUser, postSignInUser } from '../controllers/authController.js';
import { validateName, validateSchemaCadastro } from '../middlewares/signUpMiddleware.js';
import validateSchemaLogin from '../middlewares/signInMiddleware.js';

const signRouter = Router();

signRouter.post('/sign-up', validateName, validateSchemaCadastro, postSignUpUser);
signRouter.post('/sign-in', validateSchemaLogin, postSignInUser); 

export default signRouter;