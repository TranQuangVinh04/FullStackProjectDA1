import { NOT_FOUND, OK } from "../constants/http";
import mongoose from "mongoose";
import DatabaseNatification from "../model/notification.model";

import { Request,Response } from "express";
import { readNatification } from "../services/natification.service";


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
export const readNatificationUser = async (req:Request<{id?:string},{},{}>,res:Response)=>{
    const userId = req.userId;
    const {id} = req.params;
    const idMongo = new mongoose.Types.ObjectId(id);
    const natification = await readNatification(idMongo,userId);
    if(natification && natification.success){
        return res.status(OK).json({
            success:natification.success,
            message:natification.message,
            natification:natification.natificationUpdate
        });
    }
    if(natification && natification.success == false){
        return res.status(NOT_FOUND).json({
            success:natification.success,
            message:natification.message
        });
    }
}
