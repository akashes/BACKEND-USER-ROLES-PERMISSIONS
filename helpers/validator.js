import {check} from 'express-validator'


export const registerValidator=[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),
    check('password','Password is required').not().isEmpty(),

]

export const loginValidator=[
    check('email','Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),
    check('password','Password is required').not().isEmpty(),

]

export const createUserValidator=[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),

]
