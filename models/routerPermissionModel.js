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
    permission:{
        type:Number, //0,1,2,3
        required:true,
    }
    

})

const RouterPermission = mongoose.model("RouterPermission",routerPermissionSchema)
export default RouterPermission