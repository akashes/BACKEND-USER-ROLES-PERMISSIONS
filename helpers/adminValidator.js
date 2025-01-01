import {check} from 'express-validator'



//permission
export const permissionAddValidator=[
    check('permission_name','permission_name is required').not().isEmpty()

]
export const permissionDeleteValidator=[
    check('id',' id is required').not().isEmpty()

]
export const permissionUpdateValidator=[
    check('id',' Id is required').not().isEmpty(),
    check('permission_name','permission_name is required').not().isEmpty()
]



//category
export const categoryAddValidator=[
    check('category_name','category_name is required').not().isEmpty(),
]

export const categoryDeleteValidator=[
    check('id',' id is required').not().isEmpty()
]
export const categoryUpdateValidator=[
    check('id',' Id is required').not().isEmpty(),
    check('category_name','category_name is required').not().isEmpty(),
]