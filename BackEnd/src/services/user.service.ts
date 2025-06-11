import { cloudinary } from "../config/cloudinary";
import UserModel from "../model/user.model";
import { UserDocument } from "../model/user.model";
import bcrypt from "bcryptjs";
import { natificationService } from "./natification.service";   
import HashtagModel from "../model/hashtag.model";

// Types
type SetFollowOrUnfollowParams = {
    userCurrent: UserDocument;
    userMotify: UserDocument;
    isFollow: boolean;
}

type ChangePasswordParams = {
    user: UserDocument;
    currentPassword: string;
    newPassword: string;
}

type UpdateFullnameUserParams = {
    user: UserDocument;
    fullname: string;
}

type UploadImageProfileParams = {
    image: string;
    user: UserDocument;
}

type UploadCoverImageParams = {
    image: string;
    user: UserDocument;
}

type UpdateBioUserParams = {
    bio: string;
    user: UserDocument;
}

class UserService {
    private static instance: UserService;
    
    private constructor() {}
    
    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    // public async getProfile(username:string) {
    //     const user = await UserModel.findOne({username:username})
    //     .select("-password -role -createdAt -updatedAt -__v")
    //     .populate("followers", "-password -email -role -createdAt -updatedAt -__v")
    //     .populate("following", "-password -email -role -createdAt -updatedAt -__v");
    //     return {success:true, message:"Lấy Thông Tin Người Dùng Thành Công", data:user};
    // }
    public async setFollowOrUnfollow(data: SetFollowOrUnfollowParams) {
        if (data.isFollow) {
            await UserModel.findByIdAndUpdate(data.userCurrent._id, { $pull: { following: data.userMotify._id } });
            await UserModel.findByIdAndUpdate(data.userMotify._id, { $pull: { followers: data.userCurrent._id } });
            return { success: true, message: "Đã Hủy Theo Dõi Người Dùng" };
        } else {
            await UserModel.findByIdAndUpdate(data.userCurrent._id, { $push: { following: data.userMotify._id } });
            await UserModel.findByIdAndUpdate(data.userMotify._id, { $push: { followers: data.userCurrent._id } });
            await natificationService.createNotification({
                from: data.userCurrent._id,
                to: data.userMotify._id,
                type: "follow",
                uniqueIdentifier: `${data.userCurrent._id}_${data.userMotify._id}_follow`
            });
            return { success: true, message: "Đã Theo Dõi Người Dùng" };
        }
    }

    public async changePassword(data: ChangePasswordParams) {
        const verifyPassword = await bcrypt.compare(data.currentPassword, data.user.password);
        if (!verifyPassword) {
            return { success: false, message: "Mật Khẩu Hiện Tại Không Đúng" };
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.newPassword, salt);
        data.user.password = hashPassword;
        await data.user.save();
        
        return { success: true, message: "Đã Đổi Mật Khẩu" };
    }

    public async updateFullname(data: UpdateFullnameUserParams) {
        data.user.fullname = data.fullname;
        await data.user.save();
        return { success: true, message: "Đã Cập Nhật Thông Tin Người Dùng" };
    }

    public async uploadImageProfile(data: UploadImageProfileParams) {
        data.user.profileImg = data.image;
        await data.user.save();
        return { success: true, message: "Đã Cập Nhật Ảnh Đại Diện Người Dùng" };
    }

    public async uploadCoverImage(data: UploadCoverImageParams) {
        data.user.converImg = data.image;
        await data.user.save();
        return { success: true, message: "Đã Cập Nhật Ảnh Bìa Người Dùng" };
    }

    public async updateBio(data: UpdateBioUserParams) {
        data.user.link = data.bio;
        await data.user.save();
        return { success: true, message: "Đã Cập Nhật Thông Tin Người Dùng" };
    }
    public async searchUsers(query: string) {
        const users = await UserModel.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { fullname: { $regex: query, $options: 'i' } }
            ]
        }).select("-password -role -createdAt -updatedAt -__v -email");
        if (!users) {
            return { success: false, message: "Không Tìm Thấy Người Dùng" };
        }
        return {success: true, message: "Tìm Kiếm Người Dùng Thành Công", users: users};
    }
    public async getSuggestionUser(userId:string) {
        const currentUser = await UserModel.findById(userId);
        if(!currentUser){
            return {success:false, message:"Người Dùng Không Tồn Tại"};
        }
        const users = await UserModel.find({
            $and: [
                { _id: { $ne: currentUser._id } },
                { status: "active" },
                { _id: { $nin: currentUser.following } }
            ]
        }).select("_id username fullname profileImg").limit(5);
        if(!users){
            return {success:false, message:"Người Dùng Không Tồn Tại"};
        }
        return {success:true, message:"Lấy Danh Sách Người Dùng Thành Công", data:users};
    }
    public async getHashtag() {
        
        const topHashtags = await HashtagModel.find()
                .sort({ count: -1 })
                .limit(3)
                .select("name count");
        if(!topHashtags || topHashtags.length === 0){
            return {success:true, message:"Không Tìm Thấy Hashtag",data:[]};
        }
        return { success: true, message:"Lấy Danh Sách Hashtag Thành Công", data: topHashtags };
        
    }
}

export const userService = UserService.getInstance();

