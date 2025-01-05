import {validationResult} from 'express-validator'
import { comparePassword, hashPassword } from '../helpers/bcrypt.js';
import User from '../models/user.model.js';
import { generateJwtToken } from '../helpers/generateAccessToken.js';
import Permission from '../models/permissionModel.js';
import UserPermission from '../models/userPermission.model.js';


export const registerUser = async (req, res) => {
    try {
        //express-validator
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(200).json({

                success:false,
                message:'Errors',
                errors:errors.array()
            })
        }



        const{name,email,password}=req.body

        //checking if already exists
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({
            success:false,
            message:'Email already exists',

        })
        const hashedPassword = await hashPassword(password)

        //creating new user and sending success response
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        })

        // assigning default permissions
        let permissionArray = []
        const defaultPermissions = await Permission.find({is_default:1})
        if(defaultPermissions.length>0){
            
            defaultPermissions.forEach(permission=>{
                permissionArray.push({
                    permission_name:permission.permission_name,
                    permission_value:[0,1,2,3]

                })
            })
        }

        const id = user._id
        const newUserPermission= new UserPermission({
            user_id:id,
            permissions:permissionArray
        })
        const newUserPermissionData = await newUserPermission.save()
        res.status(200).json({
            success:true,
            message:'User created successfully',
            data:user,
            permissionStatus:newUserPermissionData
        })

        
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Error occurred while creating user',
            
        })
    }
};

export const loginUser=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(200).json({

                success:false,
                message:'Errors',
                errors:errors.array()
            })
        }
        const{email,password}=req.body
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({
            success:false,
            message:'Invalid email or password',
        })
 
        const isValidPassword = await comparePassword(password,user.password)
        if(!isValidPassword) return res.status(400).json({
            success:false,
            message:'Invalid email or password',
        })
        const accessToken = await generateJwtToken(user)

        //getting user data with all permissions
        const result =   await User.aggregate([
            {
                $match:{email:user.email}
            },
            {
                $lookup:{
                    from:'userpermissions',
                    localField:"_id",
                    foreignField:"user_id",
                    as:"permissions"
                }
            },
            {
                $project:{
                    _id:0,
                    name:1,
                    email:1,
                    role:1,
                    permissions:{  // this permissions field is an array , so to access values need
                        $cond:{         // to use [0] index. to avoid that we are returning the first index as result if permissions is array . reducing the work of frontend
                            if:{$isArray:"$permissions"},
                            then:{$arrayElemAt:["$permissions",0]},
                            else:null
                        }
                    }
 
                }
            },
            {
                $addFields:{
                    "permissions":{
                        "permissions":"$permissions.permissions"
                    }

                }
            }, 
          
           // even null is used in else portion if there is no permissions then permission field would'nt be there
           //so we are adding a field with name permissions and value of permissions field
        ])
        console.log(result) 
       


        res.status(200).json({
            success:true,
            message:'Logged in successfully',
            tokenType:"Bearer",
            accessToken:accessToken,
            data:result[0]
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:'Invalid credentials',
        })
    }
}

export const getProfile=async(req,res)=>{
    try {
        const id = req.user.id
        const user = await User.findById(id)
        if(!user) return res.status(400).json({
            success:false,
            message:'User not found',
        })

        res.status(200).json({
            success:true,
            message:'Profile',
            data:user
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:'Error fetching profile',
        })
        
    }
}