import User from "../models/user.model.js"
import mongoose from "mongoose";

export const getUserPermissionsData=async(userId)=>{
    console.log({userId})
    try {
        
        const user = await User.aggregate([
            {
              $match: {
                _id:  new mongoose.Types.ObjectId(userId)
              },
            },
            {
              $lookup: {
                from: "userpermissions",
                localField: "_id",
                foreignField: "user_id",
                as: "permissions",
              },
            },
            {
              $project: {
                _id: 0,
                role: 1,
                permissions: {
                  $cond: {
                    if: { $isArray: "$permissions" },
                    then: { $arrayElemAt: ["$permissions", 0] },
                    else: null,
                  },
                },
              },
            },
            {
              $addFields: {
                permissions: {
                  permissions: "$permissions.permissions",
                },
              },
            },
          ]);
          console.log(user)

          return user[0]


    } catch (error) {
        console.log(error)
    }
}