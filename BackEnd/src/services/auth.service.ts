import setTokenCookie from "../utils/setTokenCookie";
import UserModel from "../model/user.model";
import {compareValue, hashValue} from "../utils/bcrypt";
import {Response} from "express";
import { BAD_REQUEST, NOT_FOUND } from "../constants/http";
export type CreateAccountParams = {
    fullname:string;
    username: string;
    email:string,
    password:string,
    userAgent? :string,
}
export type LoginAccountParams = {
    email:string,
    password:string,
    userAgent? :string,
}

export const createAccount = async (data:CreateAccountParams,res:Response) => {
    //verify email in database
    const isEmail = await UserModel.exists({ email: data.email });
    const isUsername = await UserModel.exists({ username:data.username });
    if (isEmail) {
        return "Email Đã Tồn Tại"

    }
    if (isUsername) {
        return "Tên Người Dùng Đã Tồn Tại";
    }
    //hashPassword
    const hashPassword =await hashValue(data.password);
    //create user
    const user = new UserModel({
        fullname:data.fullname,
        username:data.username,
        email:data.email,
        password:hashPassword
    });

    //set token jwt
    setTokenCookie(user._id,res)

    //save 
        await user.save();
        user.password ="null";
        return {success:true,data:user};
}
export const loginAccount = async (data:LoginAccountParams,res:Response) =>{
    
    // verify email
    const isEmail = await UserModel.exists({ email: data.email });
    if(!isEmail){
        return "Email Không Tồn Tại";
    }
    const user = await UserModel.findOne({email:data.email});
    if(!user){
        return "Người Dùng Không Tồn Tại";
    }
    //compare password 
    const verifyPassword = await compareValue(data.password,user.password);
    if(verifyPassword){
        setTokenCookie(user._id,res);
        user.password = "null";
        return {success:true,data:user};
    }else{
        return "Sai Mật Khẩu Vui Lòng Nhập Lại Mật Khẩu";
    }

}
export const logoutAccount = async (res:Response) => {
    res.cookie("jwt","",{maxAge:0});
    return true;
}
