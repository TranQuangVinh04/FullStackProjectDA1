import { cloudinary } from "../config/cloudinary";
import UserModel from "../model/user.model";
import { UserDocument } from "../model/user.model";
import bcrypt from "bcryptjs";
import { createNotification } from "./natification.service";
type setFollowOrUnfollowParams = {
    userCurrent:UserDocument,
    userMotify:UserDocument,
    isFollow:boolean,
}
type changePasswordParams = {
    user:UserDocument,
    currentPassword:string,
    newPassword:string,
}
type updateFullnameUserParams = {
    user:UserDocument,
    fullname:string,
}
type uploadImageProfileParams = {
    image:string,
    user:UserDocument,
}
type uploadCoverImageParams = {
    image:string,
    user:UserDocument,
}
type updateBioUserParams = {
    bio:string,
    user:UserDocument,
}
export const setFollowOrUnfollowLogic = async (data:setFollowOrUnfollowParams)=>{
    
   if(data.isFollow){
    await UserModel.findByIdAndUpdate(data.userCurrent._id,{$pull:{following:data.userMotify._id}});
    await UserModel.findByIdAndUpdate(data.userMotify._id,{$pull:{followers:data.userCurrent._id}});
    return{success:true,message:"Đã Hủy Theo Dõi Người Dùng"}
   }else{
    await UserModel.findByIdAndUpdate(data.userCurrent._id,{$push:{following:data.userMotify._id}});
    await UserModel.findByIdAndUpdate(data.userMotify._id,{$push:{followers:data.userCurrent._id}});
    createNotification({
        from:data.userCurrent._id,
        to:data.userMotify._id,
        type:"follow",
    });
    return{success:true,message:"Đã Theo Dõi Người Dùng"}
   }
   //natification

   //
   
}
export const changePasswordLogic = async (data:changePasswordParams)=>{
    const verifyPassword = await bcrypt.compare(data.currentPassword,data.user.password);
    if(!verifyPassword){
        return{success:false,message:"Mật Khẩu Hiện Tại Không Đúng"}
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.newPassword,salt);
    data.user.password = hashPassword;
    await data.user.save();
    
    return{success:true,message:"Đã Đổi Mật Khẩu"}
}
export const updateFullnameUserLogic = async (data:updateFullnameUserParams)=>{
    data.user.fullname = data.fullname;
    await data.user.save();
    return{success:true,message:"Đã Cập Nhật Thông Tin Người Dùng"}
}
export const uploadImageProfile = async (data:uploadImageProfileParams)=>{
    data.user.profileImg = data.image;
    await data.user.save();
    return{success:true,message:"Đã Cập Nhật Ảnh Đại Diện Người Dùng"}
}
export const uploadCoverImage = async (data:uploadCoverImageParams)=>{
    data.user.converImg = data.image;
    await data.user.save();
    return{success:true,message:"Đã Cập Nhật Ảnh Bìa Người Dùng"}
}
export const updateBio = async (data:updateBioUserParams)=>{
    data.user.link = data.bio;
    await data.user.save();
    return{success:true,message:"Đã Cập Nhật Thông Tin Người Dùng"}
}

