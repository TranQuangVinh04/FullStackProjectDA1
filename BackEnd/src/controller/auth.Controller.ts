import {Request,Response} from "express";
import {z} from "zod";
import { OK ,CREATED, NOT_FOUND} from "../constants/http";
import { createAccount , loginAccount ,logoutAccount} from "../services/auth.service";
import UserModel from "../model/user.model";

const resgiterSchema = z
    .object({
        username:z.string().min(8).max(50),
        fullname:z.string().min(1).max(200),
        email:z.string().email().min(1).max(255),
        password:z.string().min(6).max(255),
        comfirmPassword:z.string().min(6).max(255), 
        userAgent:z.string().optional(),
    })
    .refine((data)=>data.password ===data.comfirmPassword,{
        message:"passwordComfirm not same password",
        path:["confirmPassword"],
    })
const loginSchema = z
    .object({
        email:z.string().email().min(1).max(255),
        password:z.string().min(6).max(255),
    })
export async function loginHandler(req:Request,res:Response,) {
    // verify request 
    const request = loginSchema.parse({
        ...req.body,
        userAgent:req.headers["user-agent"]
    })
    //login 
    const user = await loginAccount(request,res);

  
    //anwser request
    res.status(OK).json({
        success:true,
        message:"Đăng Nhập Thành Công",
        user:user
    }) 

}


export async function registerHandler(req:Request,res:Response,) {

    // verify request 
    const request = resgiterSchema.parse({
        ...req.body,
        userAgent:req.headers["user-agent"]
    })
    // create user
    let user = await createAccount(request,res);

    // verify user
    if(user){
        
        //anwser request
        res.status(CREATED).json({
            success:true,
            message:"Tạo Tài Khoản Thành Công",
            user:user
        })

    }else{
        throw new Error("Tạo Tài Khoản Không Thành Công");
    }

}
export async function logoutHandler(req:Request,res:Response,) {
    logoutAccount(res);
    res.status(OK).json({
        success:true,
        message:"Đã Đăng Xuất Thành Công",
    })
}
export async function getMeHandler(req:Request,res:Response,) {
    const user = await UserModel.findById(req.userId).select("-password");
    if(user){
        return res.status(OK).json({
            success:true,
            message:"Lấy Thông Tin Thành Công",
            user: user
        })
    }else{
        return res.status(NOT_FOUND).json({
            success:false,
            message:"Người Dùng Không Tồn Tại"
        })
    }
    
}