import PostModel from "../model/post.model";
import UserModel from "../model/user.model";
import mongoose from "mongoose";
import { PostDocument } from "../model/post.model";
import { UserDocument } from "../model/user.model";
import { v2 as cloudinary } from "cloudinary";
import { natificationService } from "./natification.service";
import RepostBehaviorModel from "../model/repostHavior.model";
import HashtagModel from "../model/hashtag.model";
import { getReceiverSocketId, io } from "../config/socketIo";

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
    media: {url:string,type:string}[];
    userId: mongoose.Types.ObjectId;
}

export type RepostPostParams = {
    post: PostDocument;
    description: string;
    reason: string;
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
        const hashtagRegex = /#(\w+)/g;
        const hashtags = data.content.match(hashtagRegex) || [];
  
        const newPost = new PostModel({
            user: data.userId,
            content: data.content,
            media: data.media,
        });
        for (const tag of hashtags) {
            const name = tag.substring(1);
            const hashtag = await HashtagModel.findOne({ name });
            if(!hashtag){
                const newHashtag = new HashtagModel({ name, posts: [newPost._id], count: 1 });
                newPost.hashtags.push(newHashtag._id);
                await newHashtag.save();
                await newPost.save();
            }
            if(hashtag){
                hashtag.count++;
                hashtag.posts.push(newPost._id);
                newPost.hashtags.push(hashtag._id);
                await hashtag.save();
                await newPost.save();
            }
        }
        const user = await UserModel.findById(data.userId);
        if (user && user.followers.length > 0) {
            const notifications = user.followers.map((follower: any) => ({
                from: data.userId,
                to: follower,
                type: 'CreatePost',
                read:false,
                uniqueIdentifier: `${data.userId}_${follower}_${newPost._id}_CreatePost`
            }));
            await natificationService.createManyNotification(notifications);
            notifications.forEach((notification: any) => {
                const receiverSocketId = getReceiverSocketId(notification.to.toString());
                console.log(receiverSocketId);
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification", notification);
                }
            });
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
                if (cloundId && mediaItem.type == "image") {
                    await cloudinary.uploader.destroy(`social-media/${cloundId}`);
                }else{
                    await cloudinary.uploader.destroy(`social-media/${cloundId}`, {
                        resource_type: "video"
                      });
                }
            }
        }
        for(const hashtag of post.hashtags){
            await HashtagModel.updateOne({ _id: hashtag }, { $pull: { posts: post._id } },{count:{$inc:-1}});
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
                uniqueIdentifier: `${data.userId}_${data.post.user}_${data.post._id}_comment`
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
                    uniqueIdentifier: `${data.userId}_${data.post.user}_${data.post._id}_like`
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
                select: "-password -email -createdAt -updatedAt -__v -followers -following -likedPosts -role -bio",    
            })
            .populate({
                path: "comments.user",
                select: "-password -email -createdAt -updatedAt -__v -followers -following -likedPosts -role -bio",
            })
            .populate({
                path: "likes",
                select: "-password -email -createdAt -updatedAt -__v -followers -following -likedPosts -role -bio",
            });

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
        const PostUser = await PostModel.find({ user: data.user._id })
        .populate({
            path: "likes",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "fullname profileImg",
        })
        .populate({
            path: "user",
            select: "-password -email -createdAt -updatedAt -__v -followers -following -likedPosts -role -bio -email",
        });
        if (PostUser.length == 0) {
            return { success: false, data: [], message: "Người Dùng Không Có Bài Viết Nào" };
        }
        return { success: true, data: PostUser, message: "Tất Cả Bài Viết Của Người Dùng" };
    }

    public async updatePost(data: UpdatePostParams) {
        const post = await PostModel.findById(data.idPost);
        if (!post) {
            return { success: false, message: "Post không tồn tại" };
        }
        if(post.user.toString() !== data.userId.toString()){
            return {success:false,message:"Bạn không có quyền cập nhật bài viết này"};
        }
        const existingMediaIds = data.media.map(item => item.url.split("/").pop()?.split(".")[0]);
        if(post.media.length > 0 && data.media.length == 0){
            for(const mediaItem of post.media){
                const cloudId = mediaItem.url.split("/").pop()?.split(".")[0];
                if(cloudId){
                    await cloudinary.uploader.destroy(`social-media/${cloudId}`);
                }
            }
        }
        if(data.media.length > 0){
            for(const postItem of post.media){
                const mediaId = postItem.url.split("/").pop()?.split(".")[0];
                const resuft = existingMediaIds.includes(mediaId);
                if(!resuft){
                    if (postItem.type == "image") {   
                        await cloudinary.uploader.destroy(`social-media/${mediaId}`);
                       
                    }else{
                        await cloudinary.uploader.destroy(`social-media/${mediaId}`, {
                            resource_type: "video"
                          });
    
                    }
                }
            }
        }
                
        const updatedPost = await PostModel.findByIdAndUpdate(
            data.idPost,
            {
                content: data.content,
                media: data.media || [],
            },
            {
                new: true
            }
        );

        if (updatedPost && updatedPost.content == data.content) {
            return { success: true, data: updatedPost, message: "Cập Nhật Post Thành Công" };
        }
    }

    public async repostPost(data: RepostPostParams) {
        const {post,description,reason} = data;
        const uniqueIdentifier = this.createUniqueIdentifier(post._id.toString(),post.user.toString(),reason);
        const bulkOps =  [{
            updateOne: {
              filter: { uniqueIdentifier: uniqueIdentifier },
              update: {
                $set: { 
                  post: post._id,
                  text: description,
                  problem: reason,
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
    public async searchPost(query: string) {
        const posts = await PostModel.find({
           
            content: { $regex: query, $options: 'i' },
               
            
        })
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "fullname profileImg",
        });
        if(!posts){
            return {success:false,message:"Không tìm thấy bài viết"};
        }
        return {success:true,message:"Tìm kiếm bài viết thành công",posts:posts};
    }
}

export const postService = PostService.getInstance();
