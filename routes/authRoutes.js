import express from 'express'
import { registerValidator,loginValidator } from '../utils/validators.js'
import { login, logout, register } from '../controller/authController.js'

const router = express.Router()

router.post('/register',registerValidator,register)
router.post('/login',loginValidator,login)
router.get('/logout',logout)

export default router;