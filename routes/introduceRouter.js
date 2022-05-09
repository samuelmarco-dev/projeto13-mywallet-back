import { Router } from 'express';

import { postIntroduceEntry, postIntroduceExit } from './../controllers/introduceController.js';

const introduceRouter = Router();

introduceRouter.post('/introduce-entry', postIntroduceEntry);
introduceRouter.post('/introduce-exit', postIntroduceExit);

export default introduceRouter;