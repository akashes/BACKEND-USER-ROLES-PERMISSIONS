import { validationResult } from "express-validator"
import Randomstring from "randomstring"
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import { hashPassword } from "../helpers/bcrypt.js"
import { sendMail } from "../helpers/nodemailer.js"

export const createUser=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success:false,
                errors: errors.array()
             })
        }
        const{name,email,role}=req.body
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
                data:savedUser
            })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success:false,
            message:"Error creating user"

        })
    }
}