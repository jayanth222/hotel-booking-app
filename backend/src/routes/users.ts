import express,{Request,Response} from 'express';
import User from '../models/user'
import jwt from 'jsonwebtoken';
import {check, validationResult} from 'express-validator'
// import zod from 'zod'

const router=express.Router();

// const registerBody=zod.object({
//     email: zod.string().email(),
//     password: zod.string().min(6),
//     firstName: zod.string(),
//     lastName: zod.string()

// })
// const {success} = registerBody.safeParse(req.body);
// if(!success){
//     return res.status(400).json({
//         message: "Incorrect inputs/ Incorrect inputs"
//     })
// }


// middle ware approach for validation using express-validator
// 
// this is inside post 

router.post('/register',[
    check("email", "Email is required").isEmail(),
    check("password", "password with 6 or more characters is required").isLength({min: 6}),
    check("firstName", "First Name is required").isLength({min: 1}),
    check("lastName", "Last Name is required").isLength({min: 1})
    ]
,async(req: Request,res: Response)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message: errors.array()})
    }

    try{
        let user=await User.findOne({
            email: req.body.email,
        });
        if(user){
            res.status(400).json({
                message: "User already exists"
            })
        }

        user=new User(req.body);
        await user.save();
        const token=jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET_KEY as string,{
                expiresIn: '1d'
            }
        );
        res.cookie('auth_token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV==="production",
            maxAge: 86400000,
        })
        return res.json({
            message: "User registerd OK"
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

export default router;