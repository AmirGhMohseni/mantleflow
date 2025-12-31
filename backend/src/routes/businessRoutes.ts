import { Router } from 'express';
import { getBusinesses, registerBusiness, getBusinessByAddress } from '../controllers/businessController';

const router = Router();

router.get('/', getBusinesses);
router.post('/', registerBusiness);
router.get('/:address', getBusinessByAddress); // اضافه کردن endpoint جدید

export default router;
