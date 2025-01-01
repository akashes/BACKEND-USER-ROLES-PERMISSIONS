import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './db/db.js'
connectDB()
import express from 'express'
import authRoute from './routes/auth.route.js'
import adminRoute from './routes/admin.route.js'
import commonRoute from './routes/common.route.js'

const app = express()

const PORT = process.env.SERVER_PORT || 8000


//middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//routes
//auth route
app.use('/api/auth',authRoute)

//admin route
app.use('/api/admin',adminRoute)

//common route
app.use('/api',commonRoute)

app.listen(PORT, () => {

    console.log('-----------------------------');
    console.log('-----------------------------');
    console.log(`server running on port `+PORT);
});