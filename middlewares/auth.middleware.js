import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

export const verifyToken = async(req,res,next)=>{
    const BearerToken = req.header('Authorization') || req.body.token || req.query.token || req.headers.token;
    if(!BearerToken){
        return res.status(403).json({
            success:false,
            message:'Unauthorized'
        });
    }

    try {
        const token = BearerToken.split(" ")[1];
       const decodedData= jwt.verify(token,process.env.ACCESS_SECRET_TOKEN)
          console.log({decodedData})
          const expTime = new Date(decodedData.exp*1000)
          console.log('token is valid until',expTime.toLocaleString())
       req.user = decodedData
       next()

      
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message: "Invalid token"

        })
    }
}
