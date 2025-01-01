import express from 'express';
import { permissionAddValidator, permissionDeleteValidator, permissionUpdateValidator } from '../helpers/adminValidator.js';
import { addPermission, deletePermission, getPermission, updatePermission } from '../controllers/admin/permission.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const adminRoute = express.Router();


//permission routes
adminRoute.post('/add-permission',verifyToken,isAdmin,permissionAddValidator,addPermission)
adminRoute.get('/get-permissions',verifyToken,isAdmin,getPermission)
adminRoute.put('/update-permission',verifyToken,isAdmin,permissionUpdateValidator,verifyToken,updatePermission)
adminRoute.delete('/delete-permission',verifyToken,isAdmin,permissionDeleteValidator,deletePermission)

export default adminRoute;