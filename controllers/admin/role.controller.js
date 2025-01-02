import { validationResult } from "express-validator"
import Role from "../../models/role.model.js"

export const addRole =async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                 errors: errors.array() 

            })
        }
        const {role_name,value}=req.body
      
        const role = new Role({
            role_name,
            value
        })
        const roleData = await role.save()
        res.status(201).json({
            success:true,
            data:roleData
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status:false,
            message:"Error"
        })
    }
}

export const getRoles=async(req,res)=>{
    try {
        const roles = await Role.find({
            value:{$ne:1}   // to exclude admin role
        })
        if(roles.length==0){
            return res.status(404).json({
                success:false,
                message:"No roles found"
            })
        }
        res.status(200).json({
            success:true,
            data:roles
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status:false,
            message:"Error"
        })
    
    }
}