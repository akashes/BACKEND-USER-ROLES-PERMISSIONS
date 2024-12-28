import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({

    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    permissions:[
    
       {
         permission_name:String,
        permission_value:[Number] //0->create ,1->read,2->update,3->delete
      }

    ]

    

})

const Permission = mongoose.model("Permission",permissionSchema)
export default Permission