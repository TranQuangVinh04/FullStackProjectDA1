import PostModel from "../model/post.model";

import UserModel from "../model/user.model";

import mongoose from "mongoose";

import {PostDocument} from "../model/post.model";

import { UserDocument } from "../model/user.model";
    
import {cloudinary} from "../config/cloudinary";

import DatabaseNatification from "../model/notification";

import { createNotification } from "./natification.service";

//type
export type CreatePostParams = {
    content:string;
    media:object[];
    userId:mongoose.Types.ObjectId,
}
export type DeletePostParams = {
    idPost:mongoose.Types.ObjectId,
    userId:mongoose.Types.ObjectId,
}
export type CommentPostParams = {
    content:string,
    userId:mongoose.Types.ObjectId,
    post:PostDocument,
}
export type LikePostParams = {
    userId:mongoose.Types.ObjectId,
    post:PostDocument,
}
export type GetAllLikePostParams = {
    user:UserDocument,
}
export type GetFollowsParams = {
    user:UserDocument,
}
export type GetFollowingsParams = {
    user:UserDocument,
}
export type GetFollowingsPostParams = {
    user:UserDocument,
}
export type GetPostUserParams = {
    user:UserDocument,
}
export type UpdatePostParams = {
    idPost:mongoose.Types.ObjectId,
    content:string,
}
export const CreatePost = async (data:CreatePostParams) => {
    

    const newPost = new PostModel({
        user:data.userId,
        content:data.content,
        media:data.media,

    });
    const user = await UserModel.findById(data.userId);
    if(user && user.followers.length > 0){
        const notifications = user.followers.map((follower:any) => ({
            from: data.userId,
            to: follower,
            type: 'CreatePost',   
        }));
        await DatabaseNatification.insertMany(notifications);
    }
    await newPost.save();
    await newPost.populate("user", "username profileImg");
    return {success:true,data:newPost};

}
export const deletePost = async (data:DeletePostParams) => {
    const post = await PostModel.findById(data.idPost);
    if(!post){
        return "Post Không Tồn Tại"
       
    }
    if (post.user.toString() !== data.userId.toString()) {
        throw new Error("Không có quyền xóa post này");
    }
    if (post.media && post.media.length > 0) {
        for (const mediaItem of post.media) {
            const cloundId = mediaItem.url.split("/").pop()?.split(".")[0];
            if (cloundId) {
                await cloudinary.uploader.destroy(cloundId);
            }
        }
    }
    await UserModel.updateMany(
        { likedPosts: post._id },
        { $pull: { likedPosts: post._id } }
    );

    await PostModel.findByIdAndDelete(post._id);
    return { success: true, message: "Đã xóa post thành công" };
    
}

export const commentPost = async (data:CommentPostParams) => {
    const comment = {
        user: data.userId,
        text:data.content,
        createdAt:new Date(),
    }
    await data.post.comments.push(comment);

    await data.post.save();
    //natification
    if(data.userId.toString() !== data.post.user.toString()){
        createNotification({
            from:data.userId,
            to:data.post.user,
            type:"comment",
        });
    }

    return {success:true,message:"Đã comment thành công",data:data.post};
}

export const likePost = async(data:LikePostParams) => {
    const checkLike = data.post.likes.includes(data.userId);
    
    if(checkLike){
        await PostModel.updateOne({_id:data.post._id}, {$pull:{likes:data.userId}})
        await UserModel.updateOne({_id:data.userId}, {$pull:{likedPosts:data.post._id}})
        return {success:true,message:"Đã unlike thành công"};
    }else{
        await PostModel.updateOne({_id:data.post._id}, {$push:{likes:data.userId}})
        await UserModel.updateOne({_id:data.userId}, {$push:{likedPosts:data.post._id}})
        if(data.userId.toString() !== data.post.user.toString()){
            createNotification({
                from:data.userId,
                to:data.post.user,
                type:"like",
            });
        }
        return {success:true,message:"Đã like thành công"};
    }
    
}

export const getAllPost = async ()=>{
    const post = await PostModel.find()
        .sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password",
        })
        .populate({
            path:"comments.user",
            select:"-password",
        })
    return post;
}
export const getAllLikePost = async (data:GetAllLikePostParams)=>{
    const likePosts = await PostModel.find({_id:{$in:data.user.likedPosts}})
        .populate({
            path:"user",
            select:"-password",
        })
        .populate({
            path:"comments.user",
            select:"-password",
        })
    return likePosts;
}
export const getFollowers = async (data:GetFollowsParams)=>{
    const followers = await UserModel.find({_id:{$in:data.user.followers}})
    if(followers.length == 0){
        return {success:false,data:[],message:"Người Dùng Không Có Theo Dõi Ai"}
    }
    return {success:true,data:followers,message:"Tất Cả Người Theo Dõi Của Bạn"};
}
export const getFollowings = async (data:GetFollowingsParams)=>{
    const followings = await UserModel.find({_id:{$in:data.user.following}})
    if(followings.length == 0){
        return {success:false,data:[],message:"Người Dùng Không Theo Dõi Ai"}
    }
    return {success:true,data:followings,message:"Tất Cả Người mà Người Dùng đang theo dõi"};
}
export const getFollowingsPost = async (data:GetFollowingsPostParams)=>{
    const PostFollowings = await PostModel.find({user:{$in:data.user.following}})
    if(PostFollowings.length == 0){
        return {success:false,data:[],message:"Không Có Bài Viết Nào Của Người Dùng Đang Theo Dõi"}
    }
    return {success:true,data:PostFollowings,message:"Tất Cả Bài Viết Của Người Dùng Đang Theo Dõi"};
}
export const getAllPostUser = async (data:GetPostUserParams)=>{
    const PostUser = await PostModel.find({user:data.user._id})
    if(PostUser.length == 0){
        return {success:false,data:[],message:"Người Dùng Không Có Bài Viết Nào"}
    }
    return {success:true,data:PostUser,message:"Tất Cả Bài Viết Của Người Dùng"}
}
export const updatePost = async (data:UpdatePostParams)=>{
    const updatedPost = await PostModel.findByIdAndUpdate(
        data.idPost,
        {
            content: data.content,
        },
        {
            new: true
        }
    ).populate("user", "username profileImg");
    if(updatedPost && updatedPost.content == data.content){
        
        return {success:true,data:updatedPost,message:"Cập Nhật Post Thành Công"};
    }
}
