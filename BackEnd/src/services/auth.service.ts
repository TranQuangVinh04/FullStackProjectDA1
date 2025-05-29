import mongoose from "mongoose";
import UserModel from "../model/user.model";
import { compareValue, hashValue } from "../utils/bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/env";

// Types
export type CreateAccountParams = {
    fullname: string;
    username: string;
    email: string;
    password: string;
    userAgent?: string;
}

export type LoginAccountParams = {
    email: string;
    password: string;
    userAgent?: string;
    rememberMe?: boolean;
}

export type GetMeParams = {
    userId: mongoose.Types.ObjectId;
}

class AuthService {
    private static instance: AuthService;
    
    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private generateToken(userId: string, rememberMe: boolean = false): { token: string; maxAge: number } {
        const expiresIn = rememberMe ? "10d" : "3d";
        const maxAge = rememberMe ? 10 * 24 * 60 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000;
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn });
        return { token, maxAge };
    }

    public setTokenCookie(userId: string, res: Response, rememberMe: boolean = false): void {
        const { token, maxAge } = this.generateToken(userId, rememberMe);
        res.cookie("jwt", token, {
            maxAge,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"
        });
    }

    public async createAccount(data: CreateAccountParams) {
        const isEmail = await UserModel.exists({ email: data.email });
        const isUsername = await UserModel.exists({ username: data.username });
        
        if (isEmail) {
            return "Email Đã Tồn Tại";
        }
        if (isUsername) {
            return "Tên Người Dùng Đã Tồn Tại";
        }

        const hashPassword = await hashValue(data.password);
        const user = new UserModel({
            fullname: data.fullname,
            username: data.username,
            email: data.email,
            password: hashPassword
        });

        await user.save();
        user.password = "null";
        return { success: true, data: user };
    }

    public async loginAccount(data: LoginAccountParams, res: Response) {
        const isEmail = await UserModel.exists({ email: data.email });
        if (!isEmail) {
            return "Email Không Tồn Tại";
        }

        const user = await UserModel.findOne({ email: data.email });
        if (!user) {
            return "Người Dùng Không Tồn Tại";
        }

        const verifyPassword = await compareValue(data.password, user.password);
        if (verifyPassword) {
            user.password = "null";
            this.setTokenCookie(user._id.toString(), res, data.rememberMe);
            return { success: true, data: user };
        } else {
            return "Sai Mật Khẩu Vui Lòng Nhập Lại Mật Khẩu";
        }
    }

    public async logoutAccount(res: Response): Promise<boolean> {
        res.cookie("jwt", "", { maxAge: 0 });
        return true;
    }

    public async me(data: GetMeParams) {
        const users = await UserModel.findById(data.userId)
            .populate({
                path: "followers",
                select: "-password",
            })
            .populate({
                path: "following",
                select: "-password",
            });
        if (!users) {
            return { success: false, message: "Người Dùng Không Tồn Tại hoặc chưa đăng nhập" };
        }
        return { success: true, data: users };
    }
}

export const authService = AuthService.getInstance();
