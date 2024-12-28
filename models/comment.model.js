import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    comment:{
        type:String,
        required:true
    }

})

const Comment = mongoose.model("Comment",commentSchema)
export default Comment