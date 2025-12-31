import { Router } from 'express';
import { predictCashFlow } from '../controllers/aiController';

const router = Router();

router.post('/predict', predictCashFlow);

export default router;
