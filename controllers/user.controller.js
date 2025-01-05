import { validationResult } from "express-validator"
import Randomstring from "randomstring"
import User from "../models/user.model.js"
import { hashPassword } from "../helpers/bcrypt.js"
import { sendMail } from "../helpers/nodemailer.js"
import mongoose from "mongoose"
import UserPermission from "../models/userPermission.model.js"
import Permission from "../models/permissionModel.js"


export const createUser=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success:false,
                errors: errors.array()
             })
        }
        const{name,email,role,permissions}=req.body
        const isExistingUser= await User.findOne({email})
        if(isExistingUser) return res.status(400).json({
            success:false,
            message:"Email already exists"
        })

        const password = Randomstring.generate(8)
        const hashedPassword = await hashPassword(password)
        const obj={
            name,
            email,
            password:hashedPassword

        }
        if(role && role==1){
            return res.status(400).json({
                success:false,
                message:"You cant create admin user"
            })
        }else{
            obj.role = role
        }
        const user=new User(
            obj
            
        )
        const savedUser=await user.save()

        //assigning permissions
        if(permissions!=undefined && permissions.length>0){

            let permissionArray = []
               await Promise.all(
                    permissions.map(async (per) => {
                        const data = await Permission.findById(per.id);
                        if (data) {
                        
                          permissionArray.push({
                              permission_name: data.permission_name,
                              permission_value: per.value,
                          })
                        }
                        return null; 
                      })
                )
              
            
              // Filter out null values if any
              permissionArray = permissionArray.filter((item) => item !== null);
            
              //adding permission data to UserPermission collection
              const userpermission=  new UserPermission({
                    user_id:savedUser._id,
                    permissions:permissionArray


                })
                var savedUserPermission = await userpermission.save()


             

            
        }

            console.log(savedUser)
            const content = `
            <p> Hi <b>${savedUser.name}</b> Your account is created , below is your account details  </p>
            <table style="border-style:none" >
            <tr>
            <th>Name:-</th>
            <td>${savedUser.name}</td>
             </tr>
            <tr>
            <th>Email:-</th>
            <td>${savedUser.email}</td>
             </tr>
            <tr>
            <th>Password:-</th>
            <td>${password}</td>
             </tr>
            </table>
            <p> Now you can login with your email and password</p>
            `
            await sendMail(savedUser.email,'Account Created',content)
            res.status(201).json({
                success:true,
                data:savedUser,
                savedUserPermission
            })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success:false,
            message:"Error creating user"

        })
    }
}

export  const getUsers=async(req,res)=>{
    try {
        const id = req.user.id
        
        const result =await User.aggregate([
            {$match:{
                _id:{
                    $ne:new mongoose.Types.ObjectId(id)
                }
            }},
            {$lookup:{from:"userpermissions",localField:"_id",foreignField:"user_id",as:"permissions"}},
            {$project:{_id:0,name:1,email:1,password:1,role:1,permissions:{$cond:{
                if:{$isArray:"$permissions"},
                then:{$arrayElemAt:["$permissions",0]},
                else:null
            }}

            }},
            {$addFields:{
                "permissions":{
                    "permissions":"$permissions.permissions"
                }
            }}
        ])
        console.log(result)
        res.status(200).json({
            success:true,
            data:result
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success:false,
            message:"Error fetching users"
        })
    }
}

export const updateUser=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success:false,
                errors: errors.array()
             })
        }

        const{id,name}=req.body
        const isExistingUser = await User.findById(id)
        if(!isExistingUser) return res.status(404).json({
            success:false,
            message:"User not found"
        })

        const updateObj={
            name
        }
        if(req.body.role!=undefined){
            updateObj.role=req.body.role
        }
        const updatedUser = await User.findByIdAndUpdate(id,{$set:updateObj},{new:true})

        return res.status(200).json({
            success:true,
            data:updatedUser
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Error updating user"
        })
    }
}

export const deleteUser=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success:false,
                errors: errors.array()
             })
        }

        const{id}=req.body
        const isUserExists = await User.findById(id)
        if(!isUserExists) return res.status(404).json({
            success:false,
            message:"User not found"
        })
        await User.findByIdAndDelete(id)

        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Error deleting user"
        })
    }
}