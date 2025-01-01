import express from 'express'

import { verifyToken } from '../middlewares/auth.middleware.js'
import { categoryAddValidator, categoryDeleteValidator, categoryUpdateValidator } from '../helpers/adminValidator.js'
import { addCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController.js'

const router = new express.Router()




//category routes
router.post('/add-category',verifyToken,categoryAddValidator,addCategory)
router.get('/get-categories',verifyToken,getCategories)
router.post('/delete-category',verifyToken,categoryDeleteValidator,deleteCategory)
router.post('/update-category',categoryUpdateValidator,updateCategory)

export default router

