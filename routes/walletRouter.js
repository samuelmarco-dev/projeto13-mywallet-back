import { Router } from 'express';

import { getWalletUser } from './../controllers/walletController.js';
import { validateToken, validateSchemaUser } from '../middlewares/walletMiddleware.js';

const walletRouter = Router();

walletRouter.get('/wallet', validateToken, validateSchemaUser, getWalletUser);

export default walletRouter;