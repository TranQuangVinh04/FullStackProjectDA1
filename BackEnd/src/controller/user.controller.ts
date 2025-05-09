import { 
    BAD_REQUEST, 
    CREATED ,
    OK ,
    NOT_FOUND
} from "../constants/http";

import { z } from "zod";

import { 
    Request,
    Response,
} from "express";

import UserDatabase from "../model/user.model";

import { 
    setFollowOrUnfollowLogic,
    changePasswordLogic,
    updateFullnameUserLogic,
    uploadImageProfile,
    uploadCoverImage,
    updateBio,

} from "../services/user.service";

//interface
interface MyRequestParams {
    id?:string;
}
interface MyRequestParamsFollow {
    id?:string;
}
interface MyRequestBodyChangePassword {
    currentPassword:string;
    newPassword:string;
}
interface MyRequestBodyUpdateProfile {
    fullname?:string;
}
const changePasswordSchema = z.object({
    currentPassword:z.string().min(6).max(255),
    newPassword:z.string().min(6).max(255),
})
const updateProfileSchema = z.object({
    fullname:z.string().min(1).max(200).optional(),
    bio:z.string().min(1).max(200).optional(),
})

//controller
export const getProfile = async (req:Request<MyRequestParams>,res:Response)=>{
    const {id} = req.params;
    if(!id){
        throw new Error("Chưa Có Id Người Dùng");
    }
    const user = await UserDatabase.findById(id).select("-password -role -createdAt -updatedAt -__v");
    if(!user){  
        return res.status(NOT_FOUND).json({
            success:false,
            message:"Người Dùng Không Tồn Tại"
        });
    }
    return res.status(OK).json({
        success:true,
        message:"Lấy Người Dùng Thành Công",
        user:user
    });
    
}
export const setFollowOrUnfollow = async (req:Request<MyRequestParamsFollow,{},{}>,res:Response)=>{
    const {id} = req.params;
    const userId = req.userId;
    if(!id){
        throw new Error("Chưa Có Id Người Dùng");
    }
    const userMotify = await UserDatabase.findById(id);
    if(!userMotify){
        return res.status(NOT_FOUND).json({
            success:false,
            message:"Người Dùng Không Tồn Tại"
        });
    }
    const user = await UserDatabase.findById(userId);
    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            message:"Người Dùng Không Tồn Tại"
        });
    }
    if(userMotify._id.toString() === user._id.toString()){
        return res.status(BAD_REQUEST).json({
            success:false,
            message:"Không Thể Theo Dõi Chính Mình"
        });
    }
    const isFollow = userMotify.followers.includes(user._id);
    const data = {
        userCurrent:user,
        userMotify:userMotify,
        isFollow:isFollow
    }
    const result = await setFollowOrUnfollowLogic(data);
    if(result && result.success){
        return res.status(OK).json({
            success:true,
            message:result.message
        });
    }else{
        throw new Error("Lỗi Khi Theo Dõi Người Dùng");
    }
    
}
export const changePasswordUser = async (req:Request<{},{},MyRequestBodyChangePassword>,res:Response)=>{
    const request = changePasswordSchema.parse({
        ...req.body,
    })
    const user = await UserDatabase.findById(req.userId);
    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            message:"Người Dùng Không Tồn Tại"
        });
    }
    const data = {
        user:user,
        currentPassword:request.currentPassword,
        newPassword:request.newPassword
    }
   const result = await changePasswordLogic(data);

   if(result && result.success){
    return res.status(OK).json({
        success:result.success,
        message:result.message
    });
   }else{
        return res.status(BAD_REQUEST).json({
            success:result.success,
            message:result.message
        });
    }
}
export const updateFullNameUser = async (req:Request<{},{},MyRequestBodyUpdateProfile>,res:Response)=>{
    const request = updateProfileSchema.parse({
        ...req.body,
    })

    const user = await UserDatabase.findById(req.userId);

    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            message:"Người Dùng Không Tồn Tại"
        });
    }
    let fullname = request.fullname as string;
    const data = {
        user:user,
        fullname:fullname,
    }
    const result = await updateFullnameUserLogic(data);

    if(result && result.success){
        return res.status(OK).json({
            success:result.success,
            message:result.message
        });
    }else{
        throw new Error("Lỗi Khi Cập Nhật Thông Tin Người Dùng");
    }
}
export const uploadImageProfileUser = async (req:Request<{},{},{}>,res:Response)=>{
    const file = req.file;
    const user = await UserDatabase.findById(req.userId);
    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            message:"Người Dùng Không Tồn Tại"
        });
    }
    let image = "";
    if(file && file !== undefined){
        image = file.path as string;
    }
    const data = {
        image:image,
        user:user,
    }
    const result = await uploadImageProfile(data);
    if(result && result.success){
        return res.status(OK).json({
            success:result.success,
            message:result.message
        });
    }else{
        throw new Error("Lỗi Khi Cập Nhật Ảnh Đại Diện Người Dùng");
    }
}
export const uploadCoverImageUser = async (req:Request<{},{},{}>,res:Response)=>{
    const file = req.file;
    const user = await UserDatabase.findById(req.userId);
    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            message:"Người Dùng Không Tồn Tại"
        });
    }
    let image = "";
    if(file && file !== undefined){
        image = file.path as string;
    }
    const data = {
        image:image,
        user:user,
    }
    const result = await uploadCoverImage(data);

    if(result && result.success){
        return res.status(OK).json({
            success:result.success, 
            message:result.message
        });
    }else{
        throw new Error("Lỗi Khi Cập Nhật Ảnh Bìa Người Dùng");
    }
}
export const updateBioUser = async (req:Request<{},{},MyRequestBodyUpdateProfile>,res:Response)=>{
    const request = updateProfileSchema.parse({
        ...req.body,
    })
    const user = await UserDatabase.findById(req.userId);
    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            message:"Người Dùng Không Tồn Tại"
        });
    }
    const bio = request.bio as string;
    const data = {  
        bio:bio,
        user:user,
    }

    const result = await updateBio(data);

    if(result && result.success){
        return res.status(OK).json({
            success:result.success,
            message:result.message
        });
    }else{
        throw new Error("Lỗi Khi Cập Nhật Thông Tin Người Dùng");

    }
}
    