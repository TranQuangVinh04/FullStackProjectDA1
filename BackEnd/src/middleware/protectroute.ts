import {Request , Response ,  NextFunction } from "express";

import jwt from "jsonwebtoken";

import {JWT_SECRET}from "../constants/env";

import { BAD_REQUEST, UNAUTHORIZED } from "../constants/http";

import mongoose from "mongoose";

import UserModel from "../model/user.model";

//middleware verify token
export const protectRoute = async (req:Request,res:Response,next:NextFunction):Promise<any>=> {
    const token = req.cookies.jwt;
  console.log("Client Kết Nói Backend");
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
export const protectRouteAdmin = async (req:Request,res:Response,next:NextFunction):Promise<any>=> {
  const token = req.cookies.jwt;
  console.log("admin Kết Nói Backend");
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
    const user = await UserModel.findById(isCheckingCookie.userId);
    if(!user){
      return res.status(UNAUTHORIZED).json({
        error:
          "Người Dùng Không Tồn Tại Vui Lòng Đăng Nhập Lại",
      });
    }
    if(user.role !== "admin"){
      return res.status(UNAUTHORIZED).json({
        error:
          "Bạn Không Có Quyền Truy Cập Vào Trang Này",
      });
    }
    req.userId = isCheckingCookie.userId;
     next();

}
