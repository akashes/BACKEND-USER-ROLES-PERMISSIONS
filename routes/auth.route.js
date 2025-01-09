import express from 'express'
import { loginValidator, registerValidator } from '../helpers/validator.js'
import { getProfile, getUserPermissions, loginUser, registerUser } from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const authRoute = new express.Router()

authRoute.post('/register',registerValidator,registerUser)
authRoute.post('/login',loginValidator,loginUser)


//authenticated routes
authRoute.get('/profile',verifyToken,getProfile)

authRoute.get('/refresh-permissions',verifyToken,getUserPermissions)
//use of refresh permission endpoint : on frontend we need to refresh userpermissions ,because admin can
//change their permission any time

export default authRoute

