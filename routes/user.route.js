import express from 'express'


const userRoute = express.Router()

userRoute.post('/register',registerUser)



export default userRoute;