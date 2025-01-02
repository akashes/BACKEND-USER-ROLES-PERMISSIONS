import {validationResult} from 'express-validator'
import { comparePassword, hashPassword } from '../helpers/bcrypt.js';
import User from '../models/user.model.js';
import { generateJwtToken } from '../helpers/generateAccessToken.js';



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
            password:hashedPassword
        })
        res.status(200).json({
            success:true,
            message:'User created successfully',
            data:user
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
        res.status(200).json({
            success:true,
            message:'Logged in successfully',
            tokenType:"Bearer",
            accessToken:accessToken,
            data:user
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