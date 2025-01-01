import express from 'express'
import { loginValidator, registerValidator } from '../helpers/validator.js'
import { getProfile, loginUser, registerUser } from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const authRoute = new express.Router()

authRoute.post('/register',registerValidator,registerUser)
authRoute.post('/login',loginValidator,loginUser)


//authenticated routes
authRoute.get('/profile',verifyToken,getProfile)

export default authRoute

