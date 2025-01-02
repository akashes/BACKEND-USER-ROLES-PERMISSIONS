import {validationResult} from 'express-validator'
import Post from '../models/post.model.js'
import Category from '../models/category.model.js'


export const createPost=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                 errors: errors.array()
                 })
        }
        const{title,description,category_id}=req.body
        // const isValidCategory = await Category.find({_id:{$in:category_id}})
        // if(isValidCategory.length !== category_id.length){
        //     return res.status(400).json({
        //         success:false,
        //         errors:"One or more category ids are invalid"
        //     })
        // }
        const obj={
            title,
            description
        }
        if(req.body.category_id){
            obj.categories= req.body.category_id
        }
        const post = new Post(
            obj
        ) 
        const savedPost=await post.save()
        const postData = await Post.findById(savedPost._id).populate('categories')
        res.status(201).json({
            success:true,
            message:'Post created successfully',
            data:postData
        }) 
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const getPosts=async(req,res)=>{
    try {

        const posts = await Post.find().populate('categories')
        res.status(200).json({
            success:true,
            data:posts
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Error while fetching posts"
        })
    }
}

export const deletePost=async(req,res)=>{
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                message:"Invalid request",
            })
        }
        
        const{id}=req.body
        const isPostExists = await Post.findById(id)
        if(!isPostExists){
            return res.status(404).json({
                success:false,
                message:"Post does not exists"
            })
        }
        await Post.findByIdAndDelete(id)
        res.status(200).json({
            success:true,
            message:'Post deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:"Error while deleting post"
        })
    }
}


export const updatePost=async(req,res)=>{
    try {
        const{id,title,description,categories}=req.body
        const isPostExists = await Post.findById(id)
        if(!isPostExists){
            return res.status(404).json({
                success:false,
                message:"Post does not exists"

            })
        }
        const obj={
            title,
            description,
            
        }
        if(categories){
           
            obj.categories=categories

                // obj.categories=isPostExists.categories
                // obj.categories.push(...categories)
            
        }
        console.log(obj)
        const updatedPost = await Post.findByIdAndUpdate(id,
            {
                $set:obj
        },{new:true}
        )
        res.status(200).json({
            success:true,
            message:'Post updated successfully',
            data:updatedPost
        })
    } catch (error) {
        console.log(error)
        res.status({
            success:false,
            message:"Error while updating post"
        })
    }
}