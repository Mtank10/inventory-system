import express from 'express';
import {auth} from '../middleware/auth.js'
import { productCreateValidator, productUpdateValidator } from '../utils/validators.js';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controller/productController.js';


const router = express.Router();

router.get('/',auth,getProducts)
router.post('/',auth,productCreateValidator,createProduct)
router.put('/:id',auth,productUpdateValidator,updateProduct)
router.delete('/:id',auth,deleteProduct)

export default router;