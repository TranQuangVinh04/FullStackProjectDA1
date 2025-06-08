import { Request,Response } from "express";
import { messageService } from "../services/message.service";
import mongoose from "mongoose";
import { BAD_REQUEST, OK ,} from "../constants/http";

interface RequestParamsMessage{
    id?:string;
}
interface RequestBodyMessage{
    content:string;
}
interface RequestParamsUser{
    id?:string;
}

export const getMessageUser = async (req:Request<RequestParamsMessage,{},{}>,res:Response)=>{
    const {id} = req.params;
    const senderId = req.userId;
    const idMongo = new mongoose.Types.ObjectId(id);
    const data = {
        id:idMongo,
        senderId:senderId
    }
    const messages = await messageService.getMessage(data);
    if(messages && messages.success ){
        return res.status(OK).json({
            success:messages.success,
            message:messages.message,
            messages:messages.data
        });
    }else{
        throw new Error("Lỗi Khi Lấy Tin Nhắn");
    }
}
export const sendMessageUser = async (req:Request<RequestParamsMessage,{},RequestBodyMessage>,res:Response)=>{
    const { content } = req.body;
    
    const userId = req.userId;

    const {id} = req.params;
    const receiverId = new mongoose.Types.ObjectId(id);

    const files = req.files as Express.Multer.File[];

    const images = files ? files.map(file => ({
        url:(file as any).path,
        type:"image"
    })) : [];
   
    const data = {
        senderId:userId,
        receiverId:receiverId,
        content:content,
        images:images
    }
    const message = await messageService.sendMessage(data);
    if(message && message.success){
        return res.status(OK).json({
            success:message.success,
            message:message.message,
            data:message.data
        });
    }else{
        return res.status(BAD_REQUEST).json({
            success:message.success,
            message:message.message,
            data:[]
        });
    }
}
export const getMessageList = async (req:Request,res:Response)=>{
    const {id} = req.params;
    const idMongo = new mongoose.Types.ObjectId(id);
    const messages = await messageService.getMessageList(idMongo);
    if(messages && messages.success){
        return res.status(OK).json({
            success:messages.success,
            message:messages.message,
            data:messages.data
        });
    }else{
        return res.status(BAD_REQUEST).json({
            success:messages.success,
            message:messages.message,
            data:[]
        });
    }
}