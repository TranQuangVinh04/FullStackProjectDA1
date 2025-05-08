import PostModel from "../model/post.model";
import UserModel from "../model/user.model";
import {Response} from "express";
import mongoose from "mongoose";
import {v2 as cloudinary } from "cloudinary";
import {PostDocument} from "../model/post.model";
import { UserDocument } from "../model/user.model";

export type CreatePostParams = {
    text?:string;
    image?: any;
    userId:mongoose.Types.ObjectId,
    imageUrl:string,
}
export type DeletePostParams = {
    idPost:mongoose.Types.ObjectId,
    userId:mongoose.Types.ObjectId,
}
export type CommentPostParams = {
    text:string,
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
export const CreatePost = async (data:CreatePostParams) => {
    const user = UserModel.findById(data.userId);
    if(!user) {
        return "Người Dùng Không Tồn Tại!";
    }
    if(data.image) {
        const upLoaderImage = await cloudinary.uploader.upload(data.image);
        data.imageUrl = upLoaderImage.secure_url;
    }
    const newPost = new PostModel({
        user:data.userId,
        text: data.text,
        image: data.imageUrl ||"",

    });
    //natification

    //
    await newPost.save();
    return {success:true,data:newPost};

}
export const deletePost = async (data:DeletePostParams) => {
    const Post = await PostModel.findById(data.idPost);
    if(!Post){
        return "Post Không Tồn Tại"
       
    }
    if(Post.image){
        const newPostimage1= Post.image.split("/").pop()?.split(".")[0] as string;
        await cloudinary.uploader.destroy(newPostimage1);
    }

    const checkLikePost = Post.likes.includes(data.userId);
    if(checkLikePost){
        await UserModel.findByIdAndUpdate({_id:data.userId}, {$pull:{likedPosts:Post._id}})
    }
    await PostModel.findByIdAndDelete(Post._id);
    
    return true;
}
export const commentPost = async (data:CommentPostParams) => {
    const comment = {
        user: data.userId,
        text:data.text,
    }
    await data.post.comment.push(comment);
    await data.post.save();
    return true;
}
export const likePost = async(data:LikePostParams) => {
    
    const like = data.post.likes.includes(data.userId)
    if(like){
        await PostModel.updateOne({_id:data.post._id}, {$pull:{likes:data.userId}})
        await UserModel.updateOne({_id:data.userId}, {$pull:{likedPosts:data.post._id}})
        return {success:true,message:"Đã unlike thành công"};
    }else{
        await PostModel.updateOne({_id:data.post._id}, {$push:{likes:data.userId}})
        await UserModel.updateOne({_id:data.userId}, {$push:{likedPosts:data.post._id}})    
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
            path:"comment.user",
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
            path:"comment.user",
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

