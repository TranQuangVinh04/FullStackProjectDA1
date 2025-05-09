import {Request , Response ,  NextFunction } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET}from "../constants/env"
import { BAD_REQUEST, UNAUTHORIZED } from "../constants/http";
import mongoose from "mongoose";

// Thêm kiểu cho request có thuộc tính user
export const protectRoute = async (req:Request,res:Response,next:NextFunction):Promise<any>=> {

    const token = req.cookies.jwt;

    if (!token) {
      return res.status(UNAUTHORIZED).json({
        success:false,
        error:
          "Cookie JWT Không Tồn Tại Vui Lòng Đăng Nhập",
      });
    }

    const isCheckingCookie = jwt.verify(
      token,
      JWT_SECRET
    )as {userId:mongoose.Types.ObjectId};

    if (!isCheckingCookie) {
      return res.status(UNAUTHORIZED).json({
        error:
          "Sai Cookie Bảo Mật Vui Lòng Kiểm Tra Lại Hoặc F5 và Đăng Nhập Lại",
      });
      
    }
    req.userId = isCheckingCookie.userId;

    next();
 
};
