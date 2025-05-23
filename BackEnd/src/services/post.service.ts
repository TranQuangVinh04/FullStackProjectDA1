import PostModel from "../model/post.model";
import UserModel from "../model/user.model";
import mongoose from "mongoose";
import { PostDocument } from "../model/post.model";
import { UserDocument } from "../model/user.model";
import { v2 as cloudinary } from "cloudinary";
import DatabaseNatification from "../model/notification.model";
import { natificationService } from "./natification.service";
import RepostBehaviorModel from "../model/repostHavior.model";

// Types
export type CreatePostParams = {
    content: string;
    media: object[];
    userId: mongoose.Types.ObjectId;
}

export type DeletePostParams = {
    idPost: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
}

export type CommentPostParams = {
    content: string;
    userId: mongoose.Types.ObjectId;
    post: PostDocument;
}

export type LikePostParams = {
    userId: mongoose.Types.ObjectId;
    post: PostDocument;
}

export type GetAllLikePostParams = {
    idPost: mongoose.Types.ObjectId;
}

export type GetFollowsParams = {
    user: UserDocument;
}

export type GetFollowingsParams = {
    user: UserDocument;
}

export type GetFollowingsPostParams = {
    user: UserDocument;
}

export type GetPostUserParams = {
    user: UserDocument;
}

export type UpdatePostParams = {
    idPost: mongoose.Types.ObjectId;
    content: string;
}

export type RepostPostParams = {
    post: PostDocument;
    text: string;
    problem: string;
}
export class PostService {
    private static instance: PostService;

    constructor(
    ) {
    }
    private createUniqueIdentifier(post_id: string, userId: string, problem: string) {
        return `${post_id}_${userId}_${problem.replace(/\s+/g, '_')}`;
    }
    public static getInstance(): PostService {
        if (!PostService.instance) {
            PostService.instance = new PostService();
        }
        return PostService.instance;
    }

    public async createPost(data: CreatePostParams) {
        const newPost = new PostModel({
            user: data.userId,
            content: data.content,
            media: data.media,
        });

        const user = await UserModel.findById(data.userId);
        if (user && user.followers.length > 0) {
            const notifications = user.followers.map((follower: any) => ({
                from: data.userId,
                to: follower,
                type: 'CreatePost',
                uniqueIdentifier: `${data.userId}_${follower}_CreatePost`
            }));
            await natificationService.createManyNotification(notifications);
        }

        await newPost.save();
        await newPost.populate("user", "username profileImg");
        return { success: true, data: newPost };
    }

    public async deletePost(data: DeletePostParams) {
        const post = await PostModel.findById(data.idPost);
        if (!post) {
            return "Post Không Tồn Tại";
        }

        if (post.user.toString() !== data.userId.toString()) {
            throw new Error("Không có quyền xóa post này");
        }

        if (post.media && post.media.length > 0) {
            for (const mediaItem of post.media) {
                const cloundId = mediaItem.url.split("/").pop()?.split(".")[0];
                if (cloundId) {
                    await cloudinary.uploader.destroy(`social-media/${cloundId}`);
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

    public async commentPost(data: CommentPostParams) {
        const comment = {
            user: data.userId,
            text: data.content,
            createdAt: new Date(),
        };

        await data.post.comments.push(comment);
        await data.post.save();

        if (data.userId.toString() !== data.post.user.toString()) {
            await natificationService.createNotification({
                from: data.userId,
                to: data.post.user,
                type: "comment",
                uniqueIdentifier: `${data.userId}_${data.post.user}_comment`
            });
        }

        return { success: true, message: "Đã comment thành công", data: comment };
    }

    public async likePost(data: LikePostParams) {
        const post = await PostModel.findById(data.post._id);
        const checkLike = post?.likes.includes(data.userId);

        if (checkLike) {
            await PostModel.updateOne({ _id: data.post._id }, { $pull: { likes: data.userId } });
            await UserModel.updateOne({ _id: data.userId }, { $pull: { likedPosts: data.post._id } });
            return { success: false, message: "Đã unlike thành công" };
        } else {
            await PostModel.updateOne({ _id: data.post._id }, { $push: { likes: data.userId } });
            await UserModel.updateOne({ _id: data.userId }, { $push: { likedPosts: data.post._id } });
            if (data.userId.toString() !== data.post.user.toString()) {
                await natificationService.createNotification({
                    from: data.userId,
                    to: data.post.user,
                    type: "like",
                    uniqueIdentifier: `${data.userId}_${data.post.user}_like`
                });
               
            }
            return { success: true, message: "Đã like thành công" };
        }
    }

    public async getAllPost() {
        return await PostModel.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",    
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });
    }
    //lỗi bug bét sửa lại nè
    public async getAllLikePost(data: GetAllLikePostParams) {
        const post = await PostModel.findById(data.idPost).lean();
        
        if(!post){
            return {success:false,message:"Bài Viết Không Tồn Tại"}
        }
        
        // Đảm bảo post.likes là một mảng
        const likes = Array.isArray(post.likes) ? post.likes : [];
        
        // Tìm users với điều kiện chính xác
        const usersLike = await UserModel.find({
            _id: { $in: likes }
        })
        .select("username profileImg fullname")
        .lean();    
        return {
            success: true,
            data: usersLike,
            message: "Tất Cả Người Đã Like Bài Viết"
        };
    }

    public async getFollowers(data: GetFollowsParams) {
        const followers = await UserModel.find({ _id: { $in: data.user.followers } });
        if (followers.length == 0) {
            return { success: false, data: [], message: "Người Dùng Không Có Theo Dõi Ai" };
        }
        return { success: true, data: followers, message: "Tất Cả Người Theo Dõi Của Bạn" };
    }

    public async getFollowings(data: GetFollowingsParams) {
        const followings = await UserModel.find({ _id: { $in: data.user.following } });
        if (followings.length == 0) {
            return { success: false, data: [], message: "Người Dùng Không Theo Dõi Ai" };
        }
        return { success: true, data: followings, message: "Tất Cả Người mà Người Dùng đang theo dõi" };
    }

    public async getFollowingsPost(data: GetFollowingsPostParams) {
        const PostFollowings = await PostModel.find({ user: { $in: data.user.following } });
        if (PostFollowings.length == 0) {
            return { success: false, data: [], message: "Không Có Bài Viết Nào Của Người Dùng Đang Theo Dõi" };
        }
        return { success: true, data: PostFollowings, message: "Tất Cả Bài Viết Của Người Dùng Đang Theo Dõi" };
    }

    public async getAllPostUser(data: GetPostUserParams) {
        const PostUser = await PostModel.find({ user: data.user._id });
        if (PostUser.length == 0) {
            return { success: false, data: [], message: "Người Dùng Không Có Bài Viết Nào" };
        }
        return { success: true, data: PostUser, message: "Tất Cả Bài Viết Của Người Dùng" };
    }

    public async updatePost(data: UpdatePostParams) {
        const updatedPost = await PostModel.findByIdAndUpdate(
            data.idPost,
            {
                content: data.content,
            },
            {
                new: true
            }
        ).populate("user", "username profileImg");

        if (updatedPost && updatedPost.content == data.content) {
            return { success: true, data: updatedPost, message: "Cập Nhật Post Thành Công" };
        }
    }

    public async repostPost(data: RepostPostParams) {
        const {post,text,problem} = data;
        const uniqueIdentifier = this.createUniqueIdentifier(post._id.toString(),post.user.toString(),problem);
        const bulkOps =  [{
            updateOne: {
              filter: { uniqueIdentifier: uniqueIdentifier },
              update: {
                $set: { 
                  post: post._id,
                  text: text,
                  problem: problem,
                  uniqueIdentifier: uniqueIdentifier,
                },
              },
              upsert: true,
            },
          }];
        
          const result = await RepostBehaviorModel.bulkWrite(bulkOps);
        if(!result){
            return {success:false,message:"Đã xảy ra lỗi khi repost bài viết"};
        }
        return {success:true,message:"Đã repost bài viết thành công"};
    }
}

export const postService = PostService.getInstance();
