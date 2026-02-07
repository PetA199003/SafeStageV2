import { Router } from 'express';
import cantonsRouter from './cantons.routes';
import regulationsRouter from './regulations.routes';
import calculationsRouter from './calculations.routes';
import examplesRouter from './examples.routes';
import contactsRouter from './contacts.routes';
import syncRouter from './sync.routes';

const router = Router();

router.use('/cantons', cantonsRouter);
router.use('/regulations', regulationsRouter);
router.use('/calculations', calculationsRouter);
router.use('/examples', examplesRouter);
router.use('/contacts', contactsRouter);
router.use('/sync', syncRouter);

export default router;
