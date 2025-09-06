import express from 'express'
import { auth } from "../middleware/auth.js" 
import { createContact, deleteContact, getContact, updateContact } from '../controller/contactController.js'

const router = express.Router()

router.get('/',auth,getContact)
router.post('/',auth,createContact)
router.put('/:id',auth,updateContact)
router.delete('/:id',auth,deleteContact)

export default router;