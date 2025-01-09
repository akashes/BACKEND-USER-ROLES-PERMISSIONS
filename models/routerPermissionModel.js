import mongoose from "mongoose";

const routerPermissionSchema = new mongoose.Schema({

    router_endpoint:{
        type:String,
        required:true
    },
    role:{
        type:Number, //0,1,2,3
        required:true,
    },
    permission_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Permission"

    },
    permission:{
        type:Array, //0,1,2,3 // array because if the route can allow multiple permissions
        required:true,
    }
    

})

const RouterPermission = mongoose.model("RouterPermission",routerPermissionSchema)
export default RouterPermission