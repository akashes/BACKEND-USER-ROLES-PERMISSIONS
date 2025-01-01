import { validationResult } from "express-validator"
import Category from "../models/category.model.js"

export const addCategory=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                message:errors.array(),

            })
        }
        const{category_name}=req.body
        const isCategoryExists = await Category.findOne({
            name:{
                $regex:`^${category_name}$`,
                $options:'i'
            }
        })
        if(isCategoryExists){
            return res.status(400).json({
                success:false,
                message:"Category already exists"
            })
        }3
        const newCategory =  new Category({
            name:category_name
        })
        const savedCategory = await newCategory.save()
        res.status(201).json({
            success:true,
            message:"Category added successfully",
            data:savedCategory
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error adding category",
            error: error.message
        })
    }
}

export const getCategories = async(req,res)=>{
    try {
        const categories  = await Category.find()
        //check if categories is empty
        if(categories.length===0){
            return res.status(404).json({
                success:false,
                message:"No categories found"
            })
        }
        res.status(200).json({
            success:true,
            message:"categories fetched successfully",
            data:categories
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

export const deleteCategory=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(200).json({

                success:false,
                message:'Errors',
                errors:errors.array()
            })
        }

        const id = req.body.id
        await Category.findByIdAndDelete(id)
        res.status(200).json({
            success:true,
            message:"Category deleted successfully"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            error:error.message
        })
    }
}


export const updateCategory=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                message:'Errors',
            })
        }
        const {id,category_name}=req.body
        console.log(id,category_name)
        const isCategoryNameAlreadyExists=await Category.findOne({
            _id:{$ne:id},
            name:{
                $regex:`^${category_name}$`,
                $options:'i'
            }
        })
        if(isCategoryNameAlreadyExists){
            return res.status(400).json({
                success:false,
                message:'Category name already exists',
            })
        }
        const category = await Category.findByIdAndUpdate(id,{$set:{name:category_name}}, {new:true})
        res.status(200).json({
            success:true,
            message:"Category updated successfully",
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            error:error.message
        })
    }
}