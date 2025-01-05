import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{ // role is optional when creating a new user
        type:Number,
        default:0  //0-> for normal user , 1-> admin, 2-> sub admin , 3-> editor
    },

})

const User = mongoose.model("User",userSchema)
export default User