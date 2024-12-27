import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './db/db.js'
connectDB()
import express from 'express'

const app = express()

const PORT = process.env.SERVER_PORT || 8000


//middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))






app.listen(PORT, () => {
    console.log('-----------------------------');
    console.log('-----------------------------');
    console.log(`server running on port `+PORT);
});