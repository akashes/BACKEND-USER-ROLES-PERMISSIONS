import mongoose from "mongoose";

const roleSchema=new mongoose.Schema({
    role_name:{
        type:String,
        required:true
    },
    value:{
        type:Number,
        required:true
    },

})

const Role=mongoose.model("Role",roleSchema);
export default Role;