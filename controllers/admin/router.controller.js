import RouterPermission from "../../models/routerPermissionModel.js";
import { validationResult } from "express-validator";


export const getAllRoutes = async(req,res)=>{
    try {

        const routes=[]
        const stack= req.app._router.stack
        stack.forEach(data => {
            if(data.name === 'router' && data.handle.stack){
                const basePath  = data.regexp.source
                .replace("^", "") // Remove the regex start anchor
                    .replace("\\/?(?=\\/|$)", "") // Remove regex for trailing slash
                    .replace(/\\/g, ""); // Remove backslashes

                    console.log(data.handle.stack.length)
                data.handle.stack.forEach((handler)=>{
                    const fullPath = `${basePath}${handler.route.path}`
                    console.log(fullPath)
                    if(!fullPath.startsWith('/api/auth') && !fullPath.startsWith('/api/admin')){
                        //to include only common route and to avoid admin and auth routes

                        
                        routes.push({
                            path:handler.route.path,
                            methods:handler.route.methods
                        })
                    }
                })
            }
                    
        });

        
        return res.status(200).json({
            success:true,
            message:"All Routes",
            data:routes,
            count:routes.length
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
             message: "Error fetching routes"
             });
        
    }
}


export const addRouterPermission=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                 errors: errors.array() 

            })
        }
        const{router_endpoint,role,permission,permission_id}=req.body
       const routerPermission= await RouterPermission.findOneAndUpdate(
            {router_endpoint,role},
            {router_endpoint,role,permission,permission_id},
            {upsert:true,new:true,setDefaultsOnInsert:true}
        )

        return res.status(200).json({
            success:true,
            message:"Router Permission Added/Updated",
            data:routerPermission
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Error adding permission"
        })
    }
}

export const getRouterPermissions=async(req,res)=>{
    try {
        const {router_endpoint} =req.body
        const routerPermissionData= await RouterPermission.find({router_endpoint}) // not findOne bcs one route may have more than one permissions data
        if(!routerPermissionData) res.status(400).json({
            success:false,
            data:"couldnt get router data"
        })
     
        const result = await RouterPermission.find({
            router_endpoint
        }).populate('permission_id')
    
        return res.status(200).json({
            success:true,
            data:result

        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message: "Error fetching router permission"
        })
    }
} 