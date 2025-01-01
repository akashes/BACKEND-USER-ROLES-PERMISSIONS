import jwt, { decode } from 'jsonwebtoken'

const Roles={
    ADMIN:1,
    USER:0  
}

export const isAdmin = async(req,res,next)=>{
   
    try {
     
        const user = req.user;
        console.log(user)

        if(user.role==null){
            return res.status(403).json({
                success:false,
                message:'Unauthorized'
            })
        }
        if(user.role!==Roles.ADMIN){
          return  res.status(400).json({
                success:false,
                message: "This route can only be accessed by admin"
            })

        }
        next()

        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message: "Something went wrong!"
        })
    }
}