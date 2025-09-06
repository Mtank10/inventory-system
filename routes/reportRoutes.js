import express from 'express';
import { auth } from '../middleware/auth.js';
import { getInventory } from '../controller/reportController.js';
import { getTransaction } from '../controller/transactionController.js';

const router = express.Router();

router.get('/inventory',auth,getInventory);
router.get('/transactions',auth,getTransaction);

export default router;