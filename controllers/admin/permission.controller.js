import { validationResult } from "express-validator"
import Permission from "../../models/permissionModel.js"


export const addPermission=async(req,res)=>{
    try {
        const errors = validationResult(req)
                if(!errors.isEmpty()){
                    return res.status(200).json({
        
                        success:false,
                        message:'Errors',
                        errors:errors.array()
                    })
                }
                const{permission_name}=req.body

                const existingPermission = await Permission.findOne({
                    permission_name:{
                     $regex:`^${permission_name}$`,
                     $options:'i'
                }})
                if(existingPermission) return res.status(400).json({
                    success:false,
                    message:'Permission already exists',
                })

                var obj={
                    permission_name,

                }
                if(req.body.default){
                    obj.is_default=parseInt(req.body.default)
                }

                const newPermission = new Permission(
                    obj

                )
            
                const permissionData = await newPermission.save()
                return res.status(200).json({
                    success:true,
                    message:'Permission added successfully',
                    data:permissionData
                })
    
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:'Invalid credentials',
        })

    }
}

export const getPermission=async(req,res)=>{
    try {
        const permissionData = await Permission.find()
        if(!permissionData) return res.status(400).json({
            success:false,
            message:'No data found',
        })

        return res.status(200).json({
            success:true,
            data:permissionData
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:'Invalid credentials',
        })
    }
}


export const deletePermission=async(req,res)=>{
    try {
        console.log('inside delete permission')
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(200).json({

                success:false,
                message:'Errors',
                errors:errors.array()
            })
        }
        const id=req.body.id
        console.log({id})
   
       await Permission.findByIdAndDelete(id)
        return res.status(200).json({
            success:true,
            message:'Permission deleted successfully',
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:'Invalid credentials',
        })
        
    }
}

export const updatePermission=async(req,res)=>{
    try {
        const errors = validationResult(req)
                if(!errors.isEmpty()){
                    return res.status(200).json({
        
                        success:false,
                        message:'Errors',
                        errors:errors.array()
                    })
                }

                const{id,permission_name}=req.body
                console.log(id,permission_name)

                const existingPermission = await Permission.findById(id)
                if(!existingPermission) return res.status(404).json({
                    success:false,
                    message:'Permission Id not found',
                })

                //excluded the current permission from the list of permissions
                const isNameAlreadyAssigned = await Permission.findOne(
                    {
                        _id:{$ne:id},
                        permission_name:{
                            $regex:`^${permission_name}$`,
                            $options:'i'
                        }
                    }
                )

                if(isNameAlreadyAssigned) return res.status(400).json({
                    success:false,
                    message:'Permission name already assigned to another permission',
                })

                var obj={
                    permission_name,


                }
                // != null because when 0 is the value of default if condition result in else block which is not intended
                if(req.body.default!= null){
                    obj.is_default=parseInt(req.body.default)
                }
               const updatedPermission= await Permission.findByIdAndUpdate(id,{$set:obj},{new:true})

                
            
                return res.status(200).json({
                    success:true,
                    message:'Permission updated successfully',
                    data:updatedPermission
                })
    
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:'could not update permission',
        })

    }
}