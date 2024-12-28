import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    categories:{
        type:Array,
        required:false

    }

})

const Post = mongoose.model("Post",postSchema)
export default Post