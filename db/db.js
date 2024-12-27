import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/user-roles')
        console.log('mongodb connection successful')
    } catch (error) {
        console.log(error)
    }
}