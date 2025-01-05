import Like from "../models/like.model.js"
import { validationResult } from "express-validator";
export const likePost=async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                 errors: errors.array()
                 });
        }
        const {post_id,user_id} = req.body // id of the post to like
        const isLiked = await Like.findOne({user_id,post_id})
        if(isLiked) return res.status(400).json({
            success:false,
            message:"You have already liked this post"
        })
        
     const like= new Like({
            user_id,
            post_id
            
        })
       const likeData= await like.save()
        res.status(200).json({
            success:true,
            message:"Post liked successfully",
            data:likeData
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Error while liking post"   
        })
    }
}

export const unlikePost=async(req,res)=>{
    try {
        const errors  = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }
        const{post_id,user_id}=req.body
        const isLiked = await Like.findOne({user_id,post_id})
        if(!isLiked) return res.status(400).json({
            success:false,
            message:"You have not liked this post"
        })
        await Like.deleteOne({user_id,post_id})
        res.status(200).json({
            success:true,
            message:"Post unliked successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Error while unliking post"
        })
    }
}

export const getPostLikes=async(req,res)=>{
    try {
        const errors  = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }
        const{post_id}=req.body
        const likeCount = await Like.countDocuments({post_id})
        res.status(200).json({
            success:true,
            message:"Like count",
            likeCount
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Error while getting post likes"
        })
    }
}