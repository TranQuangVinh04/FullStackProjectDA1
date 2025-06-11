import UserModel from "../model/user.model";
import reportModel from "../model/repostHavior.model";
import postModel from "../model/post.model";
import {hashValue} from "../utils/bcrypt";
import NotificationModel from "../model/notification.model";
import { getReceiverSocketId, io } from "../config/socketIo";

class serviceAdmin {
    private static instance: serviceAdmin;
    private constructor() {}
    public static getInstance(): serviceAdmin {
        if (!serviceAdmin.instance) {
            serviceAdmin.instance = new serviceAdmin();
        }
        return serviceAdmin.instance;
    }
    public async getUsers(userId: string) {
        try {
            const users = await UserModel.find({ _id: { $ne: userId } }).select("_id username email role status");
            return {success:true, data:users};
        } catch (error) {
            return {success:false, message:"Lỗi khi lấy danh sách người dùng"};
        }
    }
    public async changePassword(userId: string, password: string) {
        try {
            const user = await UserModel.findById(userId);
            if(!user) {
                return {success:false, message:"Người dùng không tồn tại"};
            }
            const hashedPassword = await hashValue(password);
            user.password = hashedPassword;
            await user.save();
            return {success:true, message:"Mật khẩu đã được thay đổi thành công"};
        } catch (error) {
            return {success:false, message:"Lỗi khi thay đổi mật khẩu"};
        }
    }
    public async banOrUnbanUser(userId: string) {
        try {
            const user = await UserModel.findById(userId);
            if(!user) {
                return {success:false, message:"Người dùng không tồn tại"};
            }
            if(user.status === "active") {
                user.status = "banned";
                await user.save();
                return {success:true, message:"Người dùng đã bị cấm"};
            }
            else {
                user.status = "active";
                await user.save();
                return {success:true, message:"Người dùng đã được ân xá"};
            }
            
            
        } catch (error) {
            return {success:false, message:"Lỗi khi cấm người dùng"};
        }
    }
    public async getReportHavior() {
        try {
            const report = await reportModel.find()
            .populate({
                path:"post",
                populate:{
                    path:"user",
                    select:"username fullname profileImg"
                }
            })
            return {success:true, data:report};
        } catch (error) {
            return {success:false, message:"Lỗi khi lấy danh sách báo cáo"};
        }
    }

    public async deletePost(postId: string,userId:string) {
        try {

            const post = await postModel.findById(postId);
            if(!post) {
                return {success:false, message:"Bài viết không tồn tại"};
            }
            await postModel.findByIdAndDelete(postId);
            const newNotification = new NotificationModel({
                from:userId,
                to:post.user,
                type:"deleteByAdmin",
                uniqueIdentifier:`${postId}-${userId}-deleteByAdmin`
            });
            newNotification.save();
            const receiverSocketId = getReceiverSocketId(post.user.toString());
            if(receiverSocketId ){
                io.to(receiverSocketId).emit("newNotification", newNotification);
            }

            return {success:true, message:"Bài viết đã được xóa thành công"};
        } catch (error) {
            return {success:false, message:"Lỗi khi xóa bài viết"};
        }
    }
    public async deleteRpPost(id:string) {
        try {
            const rpPost = await reportModel.findByIdAndDelete(id);
            if(rpPost){
                return {success:true, message:"Báo cáo đã được xóa thành công"};
            }
            else{
                return {success:true, message:"Báo cáo không tồn tại"};
            }
        } catch (error) {
            return {success:false, message:"Lỗi khi xóa báo cáo"};
        }
    }
}
export const adminService = serviceAdmin.getInstance();