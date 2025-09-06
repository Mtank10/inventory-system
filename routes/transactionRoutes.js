import express from 'express';
import { transactionValidator } from '../utils/validators.js';
import { auth } from '../middleware/auth.js';
import { createTransaction, getTransaction } from '../controller/transactionController.js';

const router = express.Router();

router.get('/',auth,getTransaction)
router.post('/',auth,transactionValidator,createTransaction)


export default router;