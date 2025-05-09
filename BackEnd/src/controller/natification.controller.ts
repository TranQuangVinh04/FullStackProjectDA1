import { OK } from "../constants/http";

import DatabaseNatification from "../model/notification";

import { Request,Response } from "express";

//controller
export const getNatification = async (req:Request,res:Response)=>{
  const userId = req.userId;
  const myNatification = await DatabaseNatification.find({to:userId})
        .sort({createdAt:-1})
        .populate({
            path:"from",
            select:"username fullname profileImg",
        });
    if(!myNatification){
        return res.status(OK).json({
            success:true,
            message:"Không Có Thông Báo"
        });
    }
  return res.status(OK).json({
    success:true,
    message:"Lấy Danh Sách Thông Báo Thành Công",
    myNatification:myNatification
  });
    
}
export const deleteNatification = async (req:Request,res:Response)=>{
    const userId = req.userId;
    await DatabaseNatification.deleteMany({to:userId});
    return res.status(OK).json({
        success:true,
        message:"Đã Xóa Tất Cả Thông Báo"
    });
}
