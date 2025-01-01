import jwt from 'jsonwebtoken'


export const generateJwtToken =async(user)=>{
    console.log('inside generate jwt token')
    try {
        console.log(process.env.ACCESS_SECRET_TOKEN_EXPIRATION)
        
        const payload={
            id:user._id,
            role:user.role,
        }
        return await jwt.sign(payload,process.env.ACCESS_SECRET_TOKEN,{expiresIn:process.env.ACCESS_SECRET_TOKEN_EXPIRATION})
    } catch (error) {
        console.log(error)
        console.log('error while creating jwt token')
        
    }
}