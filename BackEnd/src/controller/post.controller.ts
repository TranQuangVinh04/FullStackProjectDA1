import {
    Request,
    Response,
} from "express";

import { 
    BAD_REQUEST, 
    CREATED,
    OK,
    NOT_FOUND
} from "../constants/http";

import { postService } from "../services/post.service";

import mongoose from "mongoose";

import PostDatabase from "../model/post.model";
import UserDatabase from "../model/user.model";

//interface
interface MyRequestParamsUpdatePost {
    id?: string;
}

interface MyRequestBodyCreatePost {
    content: string;
}

interface MyRequestParamsDeletePost {
    id?: string;
}

interface MyRequestBodyComent {
    content: string;
}

interface MyRequestParamsComent {
    id?: string;
}

interface MyRequestParamsLike extends MyRequestParamsComent {}

//controller
export const createPostUser = async (req: Request<{}, {}, MyRequestBodyCreatePost>, res: Response) => {
    const { content } = req.body;
    const userId = req.userId;
    const files = req.files as Express.Multer.File[];

    const media = files ? files.map(file => ({
        url: (file as any).path,
        type: file.mimetype.startsWith("image") ? "image" : "video",
    })) : [];
    
    const newPost = await postService.createPost({
        content: content,
        media: media,
        userId: userId,
    });

    if (typeof newPost === "object" && newPost.success == true) {
        return res.status(CREATED).json({
            success: true,
            message: "Bài Post Mới Của Bạn Đã Được Tạo",
            post: newPost.data,
        });
    } else {
        throw new Error("Tạo Bài Viết Mới Không Thành Công");
    }
}

export const deletePostUser = async (req: Request<MyRequestParamsDeletePost, {}, {}>, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: "Xóa Post Không Thành Công",
        });
    }

    const newIdPost = new mongoose.Types.ObjectId(id);
    const data = {
        idPost: newIdPost,
        userId: req.userId,
    };

    const result = await postService.deletePost(data);
    
    if (result == "Post Không Tồn Tại") {
        return res.status(NOT_FOUND).json({
            success: false,
            message: "Post Không Tồn Tại",
        });
    }

    if (typeof result == "object" && result.success == true) {
        return res.status(OK).json({
            success: true,
            message: "Đã Xóa Post Thành Công",
        });
    } else {
        throw new Error("Lỗi Trong Qúa Trình Xóa Post");
    }
}

export const commentPostUser = async (req: Request<MyRequestParamsComent, {}, MyRequestBodyComent>, res: Response) => {
    const { id } = req.params as MyRequestParamsComent;
    const { userId } = req;
    const { content } = req.body;

    if (!id) {
        throw new Error("Lỗi Không truyền Id Post Khi Coment");
    }

    if (!content) {
        return res.status(BAD_REQUEST).json({
            success: false, 
            message: "Vui Lòng Nhập gì Đó Vào!"
        });
    }

    const post = await PostDatabase.findById(id);

    if (!post) {
        return res.status(NOT_FOUND).json({
            success: false, 
            message: "Post Không Tồn Tại"
        });
    }

    const data = {
        content: content,
        userId: userId,
        post: post,
    };

    const result = await postService.commentPost(data);

    if (typeof result == "object" && result.success == true) {
        return res.status(OK).json({
            success: true,
            message: "Đã comment thành công",
            comment: result.data,
        });
    } else {
        throw new Error("Comment Không Thành Công");
    }
}

export const likePostUser = async (req: Request<MyRequestParamsLike, {}, {}>, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!id) {
        throw new Error("Lỗi Không truyền Id Post Khi like");
    }

    const post = await PostDatabase.findById(id);
    if (!post) {
        return res.status(NOT_FOUND).json({
            success: false, 
            message: "Post Không Tồn Tại"
        });
    }

    const data = {
        post: post,
        userId: userId,
    };

    const result = await postService.likePost(data);

    if (result && result.success == true) {
        return res.status(OK).json({
            success: true,
            message: result.message,
        });
    } else if (result && result.success == false) {
        return res.status(OK).json({
            success: true,
            message: result.message,
        });
    } else {
        throw new Error("Like Không Thành Công");
    }
}

export const getAllPosts = async (req: Request, res: Response) => {
    const posts = await postService.getAllPost();

    if (posts.length == 0) {
        return res.status(OK).json({
            success: true,
            data: [],
        });
    }

    return res.status(OK).json({
        success: true,
        data: posts,
    });
}

export const getFollowersUser = async (req: Request, res: Response) => {
    const userId = req.userId;
    const user = await UserDatabase.findById(userId);

    if (!user) {
        return res.status(NOT_FOUND).json({
            success: false,
            message: "Người Dùng Không Tồn Tại",
        });
    }

    const data = {
        user: user,
    };

    const getFollower = await postService.getFollowers(data);

    if (getFollower.success == false) {
        return res.status(OK).json({
            success: true,
            data: [],
            message: getFollower.message,
        });
    }

    return res.status(OK).json({
        success: true,
        data: getFollower.data,
        message: getFollower.message,
    });
}

export const getFollwingsUser = async (req: Request, res: Response) => {
    const userId = req.userId;
    const user = await UserDatabase.findById(userId);

    if (!user) {
        return res.status(NOT_FOUND).json({
            success: false,
            message: "Người Dùng Không Tồn Tại",
        });
    }

    const data = {
        user: user,
    };

    const getFollowing = await postService.getFollowings(data);

    if (getFollowing.success == false) {
        return res.status(OK).json({
            success: true,
            data: [],
            message: getFollowing.message,
        });
    }

    return res.status(OK).json({
        success: true,
        data: getFollowing.data,
        message: getFollowing.message,
    });
}

export const getFollowingsPostUser = async (req: Request, res: Response) => {
    const userId = req.userId;
    const user = await UserDatabase.findById(userId);

    if (!user) {
        return res.status(NOT_FOUND).json({
            success: false,
            message: "Người Dùng Không Tồn Tại",
        });
    }

    const data = {
        user: user,
    };

    const getFollowingPost = await postService.getFollowingsPost(data);

    if (getFollowingPost.success == false) {
        return res.status(OK).json({
            success: true,
            data: [],
            message: getFollowingPost.message,
        });
    }

    return res.status(OK).json({
        success: true,
        data: getFollowingPost.data,
        message: getFollowingPost.message,
    });
}

export const getAllPostUsers = async (req: Request<{username?:string},{},{}>, res: Response) => {
    const userId = req.userId;
    const {username} = req.params;
    const user = await UserDatabase.findById(userId);
    if (!user) {
        return res.status(NOT_FOUND).json({
            success: false,
            error: "Người Dùng Không Tồn Tại",
        });
    }
    if(username == user?.username){
        const data = {
            user: user,
        };
        const getAllPost = await postService.getAllPostUser(data);
        if (getAllPost.success == false) {
            return res.status(OK).json({
                success: true,
                data: [],
                message: getAllPost.message,
            });
        }
        return res.status(OK).json({
            success: true,
            data: getAllPost.data,
            message: getAllPost.message,
        });
    }
    const userName = await UserDatabase.findOne({username:username});
    if(!userName){
        return res.status(NOT_FOUND).json({
            success: false,
            error: "Người Dùng Không Tồn Tại",
        });
    }
    const data = {
        user: userName,
    };
    const getAllPost = await postService.getAllPostUser(data);
    if (getAllPost.success == false) {
        return res.status(OK).json({
            success: true,
            data: [],
            message: getAllPost.message,
        });
    }
  
    return res.status(OK).json({
        success: true,
        data: getAllPost.data,
        message: getAllPost.message,
    });

    
}

export const updatePostUser = async (req: Request<MyRequestParamsUpdatePost, {}, {
    content: string,
    media?: {url:string,type:string}[],
}>, res: Response) => {
    const { id } = req.params;
    const { content,media } = req.body;
    if (!id) {
        return res.status(BAD_REQUEST).json({
            success: false,
            error: "Không Tìm Thấy Id Post",
        });
    }
    const newIdPost = new mongoose.Types.ObjectId(id);
    const data = {
        idPost: newIdPost,
        content: content,
        media: media || [],
        userId: req.userId,
    };

    const result = await postService.updatePost(data);

    if (result && result.success == true) {
        return res.status(OK).json({
            success: true,
            data: result.data,
            message: result.message,
        });
    } else {
        throw new Error("Cập Nhật Post Không Thành Công");
    }
}
export const repostPost = async (req: Request<{id?:string},{},{description?:string,reason:string}>, res: Response) => {
    const {id} = req.params;
    const {description , reason} = req.body;
    if(!id){
        return res.status(BAD_REQUEST).json({
            success: false,
            message: "Vui Lòng Gửi Id Bài Post",
        });
    }
    if(!description || !reason){
        return res.status(BAD_REQUEST).json({
            success: false,
            message: "vui lòng gửi vấn đề khi repost hoặc mô tả vấn đề",
        });
    }
    const post = await PostDatabase.findById(id);
    if(!post){
        return res.status(NOT_FOUND).json({
            success: false,
            message: "Không Tìm Thấy Post hoặc Bài Post Đã Bị Xóa",
        });
    }
    if(post.user.toString() === req.userId.toString()){
        return res.status(BAD_REQUEST).json({
            success: false,
            message: "Bạn không thể repost bài viết của chính mình",
        });
    }


    const data = {
        post: post,
        description: description,
        reason: reason,
    };
    const result = await postService.repostPost(data);
    if(result && result.success == true){
        return res.status(OK).json({
            success: result.success,
            message: result.message,
        });
    }
    if(result && result.success == false){
        return res.status(BAD_REQUEST).json({
            success: result.success,
            message: result.message,
        });
    }
    
    
    
}
