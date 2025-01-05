import express from 'express'

import { verifyToken } from '../middlewares/auth.middleware.js'
import { categoryAddValidator, categoryDeleteValidator, categoryUpdateValidator, postCreateValidator, postDeleteValidator, postUpdateValidator } from '../helpers/adminValidator.js'
import { addCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController.js'
import { createPost, deletePost, getPosts, updatePost } from '../controllers/post.controller.js'
import { createUserValidator, deleteUserValidator, postLikesValidator, postLikeUnlikeValidator, updateUserValidator } from '../helpers/validator.js'
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/user.controller.js'
import { getPostLikes, likePost, unlikePost } from '../controllers/like.controller.js'

const router = new express.Router()




//category routes
router.post('/add-category',verifyToken,categoryAddValidator,addCategory)
router.get('/get-categories',verifyToken,getCategories)
router.post('/delete-category',verifyToken,categoryDeleteValidator,deleteCategory)
router.post('/update-category',categoryUpdateValidator,updateCategory)


//post routes
 router.post('/create-post',verifyToken,postCreateValidator,createPost)
 router.get('/get-posts',getPosts)
 router.put('/update-post',postUpdateValidator,updatePost)
 router.delete('/delete-post',verifyToken,postDeleteValidator,deletePost)


 //user routes
 router.post('/create-user',verifyToken,createUserValidator,createUser)
 router.get('/get-users',verifyToken,getUsers)
 router.put('/update-user',verifyToken,updateUserValidator,updateUser)
 router.delete('/delete-user',deleteUserValidator,deleteUser)

 //like and unlike route
 router.post('/like-post',verifyToken,postLikeUnlikeValidator,likePost)
 router.delete('/unlike-post',verifyToken,postLikeUnlikeValidator,unlikePost)
 router.post('/post-like-count',postLikesValidator,getPostLikes)
export default router

