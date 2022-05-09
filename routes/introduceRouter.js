import { Router } from 'express';

import { postIntroduceEntry, postIntroduceExit } from './../controllers/introduceController.js';
import { validateToken, validateName, validateSchemaUserEntry, validateSchemaUserExit } 
from '../middlewares/introduceMiddleware.js';

const introduceRouter = Router();

introduceRouter.post('/introduce-entry', validateToken, validateName, validateSchemaUserEntry, postIntroduceEntry);
introduceRouter.post('/introduce-exit', validateToken, validateName, validateSchemaUserExit, postIntroduceExit);

export default introduceRouter;