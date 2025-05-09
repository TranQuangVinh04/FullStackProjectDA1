import {
    Request,
    Response,
} from "express";

import { 
    BAD_REQUEST, 
    CREATED ,
    OK ,
    NOT_FOUND
} from "../constants/http";

import { 
    commentPost, 
    CreatePost, 
    deletePost, 
    likePost ,
    getAllPost ,
    getAllLikePost ,
    getFollowers, 
    getFollowings ,
    getFollowingsPost,
    getAllPostUser,
    updatePost
} from "../services/post.service";

import mongoose from "mongoose";

import PostDatabase from "../model/post.model";

import UserDatabase from "../model/user.model";

//interface
interface MyRequestParamsUpdatePost {
    id?:string;
}
interface MyRequestBodyCreatePost {
    content:string,
  }
interface MyRequestParamsDeletePost {
    id?:string;
}
interface MyRequestBodyComent{
    content:string;
}
interface MyRequestParamsComent{
    id?:string;
}
interface MyRequestParamsLike extends MyRequestParamsComent{

}

//controller
export const createPostUser = async (req: Request<{},{},MyRequestBodyCreatePost>, res: Response) => {

    const { content } = req.body;
    
    const userId = req.userId;

    const files = req.files as Express.Multer.File[];

    let URL = "";

    const media = files ? files.map(file => ({
        url:(file as any).path,
        type:file.mimetype.startsWith("image") ? "image" : "video",
    })) : [];
    
    const newPost = await CreatePost({
        content:content,
        media:media,
        userId:userId,
    })


    if(typeof newPost === "object" && newPost.success ==true){
        return res.status(CREATED).json({
            success:true,
            message:"Bài Post Mới Của Bạn Đã Được Tạo",
            post:newPost.data,
    
        })
    }else{
        throw new Error("Tạo Bài Viết Mới Không Thành Công");
    }
    


}
export const deletePostUser = async (req:Request<MyRequestParamsDeletePost,{},{}>, res:Response)=>{
    const { id } = req.params;
    
    if(!id) {
        return res.status(BAD_REQUEST).json({
            success:false,
            error:"Xóa Post Không Thành Công",
        })
    }
    const newIdPost = new mongoose.Types.ObjectId(id);

    const data = {
        idPost: newIdPost,
        userId:req.userId,
    }
    const resuft = await deletePost(data);
    
    if(resuft =="Post Không Tồn Tại") {
        return res.status(NOT_FOUND).json({
            success:false,
            error:"Post Không Tồn Tại",
        });
    }
    if(typeof resuft == "object" && resuft.success == true) {
        return res.status(OK).json({
            success:true,
            error:"Đã Xóa Post Thành Công",
        });
    }else{
        throw new Error("Xóa Post Không Thành Công");
    }
}
export const commentPostUser = async (req:Request<MyRequestParamsComent,{},MyRequestBodyComent>, res:Response)=>{
    const { id } = req.params as MyRequestParamsComent;
    const { userId } = req;
    const {content} = req.body;
    if(!id) {
        throw new Error("Lỗi Không truyền Id Post Khi Coment");
    }
    if(!content) {
        return res.status(BAD_REQUEST).json({
            success:false, 
            error:"Vui Lòng Nhập gì Đó Vào!"});
    }

    const post = await PostDatabase.findById(id);

    if(!post) {
        return res.status(NOT_FOUND).json({
            success:false, 
            error:"Post Không Tồn Tại"});
    }
    const data = {
        content: content,
        userId: userId,
        post: post,
    }
    const resuft = await commentPost(data);

    if(typeof resuft == "object" && resuft.success == true) {
        return res.status(OK).json({
            success:true,
            message:"Đã comment thành công",
            comment: resuft.data,
        });
    }else{
        throw new Error("Comment Không Thành Công");
    }
}
export const likePostUser = async (req:Request<MyRequestParamsLike,{},{}>, res:Response)=>{
    const { id } = req.params;
    const userId = req.userId;
    if(!id){
        throw new Error("Lỗi Không truyền Id Post Khi like");
    }
    const post = await PostDatabase.findById(id);
    if(!post) {
        return res.status(NOT_FOUND).json({
            success:false, 
            error:"Post Không Tồn Tại"});
    }
    const data = {
        post: post,
        userId: userId,
    }
    const resuft = await likePost(data);

    if(resuft.success){
        return res.status(OK).json({
            success:true,
            message:resuft.message,
        });
    }else if(resuft.success == false){
       return res.status(OK).json({
        success:true,
        message:resuft.message,
       });
    }else{
        throw new Error("Like Không Thành Công");
    }
}
export const getAllPosts = async (req:Request, res:Response)=>{

    const post = await getAllPost();

    if(post.length == 0){
        return res.status(OK).json({
            success:true,
            data:[],
        });
    }
    return res.status(OK).json({
        success:true,
        data:post,
    });
    
}
export const getAllLikePostUser = async (req:Request, res:Response)=>{
    const userId = req.userId;
    const user = await UserDatabase.findById(userId);
    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            error:"Người Dùng Không Tồn Tại",
        });
    }
    const data = {
        user:user,
    }
    const likePosts = await getAllLikePost(data);
    if(likePosts.length == 0){
        return res.status(OK).json({
            success:true,
            data:[],
        });
    }
    return res.status(OK).json({
        success:true,
        data:likePosts,
    });
}
export const getFollowersUser = async (req:Request, res:Response)=>{
    const userId = req.userId;
    const user = await UserDatabase.findById(userId);
    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            error:"Người Dùng Không Tồn Tại",
        });
    }
    const data = {
        user:user,
    }
    const getFollower = await getFollowers(data);

    if(getFollower.success == false){
        return res.status(OK).json({
            success:true,
            data:[],
            message:getFollower.message,
        });
    }
    return res.status(OK).json({
        success:true,
        data:getFollower.data,
        message:getFollower.message,
    });
}
export const getFollwingsUser = async (req:Request, res:Response)=>{
    const userId = req.userId;
    const user = await UserDatabase.findById(userId);
    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            error:"Người Dùng Không Tồn Tại",
        });
    }
    const data = {
        user:user,
    }
    const Followings = await getFollowings(data);
    if(Followings.success == false){
        return res.status(OK).json({
            success:true,
            data:[],
            message:Followings.message,
        });
    }
    return res.status(OK).json({
        success:true,
        data:Followings.data,
        message:Followings.message,
    });
}
export const getFollowingsPostUser = async (req:Request, res:Response)=>{
    const userId = req.userId;
    const user = await UserDatabase.findById(userId);
    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            error:"Người Dùng Không Tồn Tại",
        });
    }
    const data = {
        user:user,
    }
    const FollowingsPost = await getFollowingsPost(data);
    if(FollowingsPost.success == false){
        return res.status(OK).json({
            success:true,
            data:[],
            message:FollowingsPost.message,
        });
    }
    return res.status(OK).json({
        success:true,
        data:FollowingsPost.data,
        message:FollowingsPost.message,
    });
}
export const getAllPostUsers = async (req:Request, res:Response)=>{

    const userId = req.userId;
    const user = await UserDatabase.findById(userId);
    if(!user){
        return res.status(NOT_FOUND).json({
            success:false,
            error:"Người Dùng Không Tồn Tại",
        });
    }
    const data = {
        user:user,
    }
    const PostUsers = await getAllPostUser(data);
    if(PostUsers.success == false){
        return res.status(OK).json({
            success:true,
            data:[],
            message:PostUsers.message,
        });
    }
    return res.status(OK).json({
        success:true,
        data:PostUsers.data,
        message:PostUsers.message,
    });
}
export const getUpdatePostUser = async (req:Request<MyRequestParamsUpdatePost>, res:Response)=>{
    const {id} = req.params;
    const post = await PostDatabase.findById(id);
    if(!post){
        return res.status(NOT_FOUND).json({
            success:false,
            error:"Post Dùng Không Tồn Tại",
        });
    }
    res.status(OK).json({
        success:true,
        data:{
            content:post.content,
            media:post.media,
        },
        message:"Lấy Post Thành Công",
    });
}
export const updatePostUser = async (req:Request<MyRequestParamsUpdatePost,{},{
    content:string,
    
}>, res:Response)=>{
    const {id} = req.params;
    const {content} = req.body;
    if(!id){
        throw new Error("Lỗi Không truyền Id Post Khi Cập Nhật");
    }
    const data = {
        idPost:new mongoose.Types.ObjectId(id),
        content:content,
    }
    const updatedPost = await updatePost(data);
    if(updatedPost && updatedPost.success == true){
        res.status(OK).json({
            success:true,
            data:updatedPost.data,
            message:updatedPost.message,

        })
    }else{
        throw new Error("Cập Nhật Post Không Thành Công");
    }
}
