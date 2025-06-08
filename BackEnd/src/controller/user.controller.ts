import { 
    BAD_REQUEST, 
    CREATED,
    OK,
    NOT_FOUND
} from "../constants/http";


import { z } from "zod";

import { 
    Request,
    Response,
} from "express";

import UserDatabase from "../model/user.model";
import { userService } from "../services/user.service";
import { cloudinary } from "../config/cloudinary";

//interface
interface MyRequestParams {
    username?: string;
}

interface MyRequestBodyChangePassword {
    currentPassword: string;
    newPassword: string;
}

const changePasswordSchema = z.object({
    confirmPassword: z.string().min(6).max(255).optional(),
    currentPassword: z.string().min(6).max(255),
    newPassword: z.string().min(6).max(255),
})

const updateProfileSchema = z.object({
    fullname: z.string().min(5).max(200).optional(),
    bio: z.string().max(200).optional(),
})

//controller
export const getProfile = async (req: Request<MyRequestParams>, res: Response) => {
    const { username } = req.params;
    if (!username) {
       throw new Error("Chưa Có Username Người Dùng");
    }
    const user = await UserDatabase.findOne({username:username}).select("-password -role -createdAt -updatedAt -__v").populate("followers").populate("following");
    if (!user) {  
        return res.status(NOT_FOUND).json({
            success: false,
            message: "Người Dùng Không Tồn Tại"
        });
    }
    return res.status(OK).json({
        success: true,
        message: "Lấy Người Dùng Thành Công",
        user: user
    });
}

export const setFollowOrUnfollow = async (req: Request<{id?:string}>, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new Error("Chưa Có Id Người Dùng");
    }
    const userCurrent = await UserDatabase.findById(req.userId);
    const userMotify = await UserDatabase.findById(id);
    if (!userCurrent || !userMotify) {
        return res.status(NOT_FOUND).json({
            success: false,
            message: "Người Dùng Không Tồn Tại"
        });
    }
    const isFollow = userCurrent.following.includes(userMotify._id);
    const data = {
        userCurrent,
        userMotify,
        isFollow
    }
    const result = await userService.setFollowOrUnfollow(data);
    return res.status(OK).json(result);
}

export const changePasswordUser = async (req: Request<{}, {}, MyRequestBodyChangePassword>, res: Response) => {
    const request = changePasswordSchema.parse({
        ...req.body,
    })
    if (request.newPassword !== request.confirmPassword) {
        console.log(request.newPassword, request.confirmPassword)
        return res.status(BAD_REQUEST).json({
            success: false,
            message: "Mật Khẩu Confirm Không Khớp"
        });
    }
   
    const user = await UserDatabase.findById(req.userId);
    if (!user) {
        return res.status(NOT_FOUND).json({
            success: false,
            message: "Người Dùng Không Tồn Tại"
        });
    }
    const data = {
        user: user,
        currentPassword: request.currentPassword,
        newPassword: request.newPassword
    }
    const result = await userService.changePassword(data);

    if (result && result.success) {
        return res.status(OK).json({
            success: result.success,
            message: result.message
        });
    } else {
        return res.status(BAD_REQUEST).json({
            success: result.success,
            message: result.message
        });
    }
}

export const uploadImageProfileUser = async (req: Request<{}, {}, {}>, res: Response) => {
    const file = req.file;
    const user = await UserDatabase.findById(req.userId);
    if (!user) {
        return res.status(NOT_FOUND).json({
            success: false,
            message: "Người Dùng Không Tồn Tại"
        });
    }
    let image = "";
    
    if (user.profileImg) {
        const cloundId = user.profileImg.split("/").pop()?.split(".")[0];
        if (cloundId) {
            await cloudinary.uploader.destroy(`social-media/${cloundId}`);
        }
    }

    image = file?.path as string;
    
    const data = {
        image: image,
        user: user,
    }
    const result = await userService.uploadImageProfile(data);
    if (result && result.success) {
        return res.status(OK).json({
            success: result.success,
            message: result.message
        });
    } else {
        throw new Error("Lỗi Khi Cập Nhật Ảnh Đại Diện Người Dùng");
    }
}

export const updateProfileUs = async (req: Request<{}, {}, { fullname?: string; bio?: string }>, res: Response) => {
    const request = updateProfileSchema.parse({
        ...req.body,
    })
    const user = await UserDatabase.findById(req.userId);
    if (!user) {
        return res.status(NOT_FOUND).json({
            success: false,
            message: "Người Dùng Không Tồn Tại"
        });
    }
    const file = req.file;
    if (file) {
        const cloundId = user.profileImg.split("/").pop()?.split(".")[0];
        if (cloundId) {
            await cloudinary.uploader.destroy(`social-media/${cloundId}`);
        }
        const image = file.path as string;
        const data = {
            image: image,
            user: user,
        }
        await userService.uploadImageProfile(data);
        
    }

    if (request.fullname) {
        const data = {
            user: user,
            fullname: request.fullname
        }
        await userService.updateFullname(data);
    }

    if (request.bio) {
        const data = {
            user: user,
            bio: request.bio
        }
        await userService.updateBio(data);
    }

    return res.status(OK).json({
        success: true,
        message: "Đã Cập Nhật Thông Tin Người Dùng"
    });
}
