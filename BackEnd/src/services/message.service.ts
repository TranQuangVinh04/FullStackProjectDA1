import DatabaseMessage from "../model/message.model";
import mongoose from "mongoose";

interface RequestParamsMessage{
   id?:mongoose.Types.ObjectId;
   senderId?:mongoose.Types.ObjectId;
}
interface schemaMessage{
    senderId:mongoose.Types.ObjectId;
    receiverId:mongoose.Types.ObjectId;
    content:string;
    images:object[];
}
export const getMessage = async (data:RequestParamsMessage)=>{
    const {id,senderId} = data;
    const messages = await DatabaseMessage.find({
        $or:[
            {senderId:senderId,receiverId:id},
            {senderId:id,receiverId:senderId}
        ]
    })
    .sort({createdAt:-1})
    return {success:true,message:"Lấy Tin Nhắn Thành Công",data:messages}
}
export const sendMessage = async (data:schemaMessage)=>{
    const {senderId,receiverId,content,images} = data;
    const newMessage = new DatabaseMessage({
        senderId:senderId,
        receiverId:receiverId,
        content:content,
        images:images
    })
    await newMessage.save();
    //realtime
    //
    return {success:true,message:"Gửi Tin Nhắn Thành Công",data:newMessage}
}
