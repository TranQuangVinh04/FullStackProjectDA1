import DatabaseMessage from "../model/message.model";
import mongoose from "mongoose";
import DatabaseUser from "../model/user.model";
import { io, getReceiverSocketId } from "../config/socketIo";

interface RequestParamsMessage {
    id?: mongoose.Types.ObjectId;
    senderId?: mongoose.Types.ObjectId;
}

interface SchemaMessage {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    content: string;
    images: object[];
}
interface RequestParamsUser{
    id?:mongoose.Types.ObjectId;
}

class MessageService {
    private static instance: MessageService;

    private constructor() {}

    public static getInstance(): MessageService {
        if (!MessageService.instance) {
            MessageService.instance = new MessageService();
        }
        return MessageService.instance;
    }
    public async getUser(data:RequestParamsUser){
       
            const {id} = data;
            const user = await DatabaseUser.findById(id).select("-password");
            if(!user){
                return {success:false,message:"Người Dùng Không Tồn Tại"};
            }
            return {success:true,message:"Lấy Người Dùng Thành Công",data:user};
        
    }

    public async getMessage(data: RequestParamsMessage) {
       
            const { id, senderId } = data;
            const messages = await DatabaseMessage.find({
                $or: [
                    { senderId: senderId, receiverId: id },
                    { senderId: id, receiverId: senderId }
                ]
            })
            .sort({ createdAt: -1 })
            .populate('senderId', 'username fullname profileImg')
            .populate('receiverId', 'username fullname profileImg');

            return {
                success: true,
                message: "Lấy Tin Nhắn Thành Công",
                data: messages
            };

    }

    public async sendMessage(data: SchemaMessage) {
       
            const { senderId, receiverId, content, images } = data;
            const newMessage = new DatabaseMessage({
                senderId,
                receiverId,
                text: content,
                image: images
            });

            const savedMessage = await newMessage.save();
            await savedMessage.populate('senderId', 'username fullname profileImg')
            await savedMessage.populate('receiverId', 'username fullname profileImg')
            const receiverSocketId = getReceiverSocketId(receiverId.toString());
        
            if(receiverSocketId){
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
            return {
                success: true,
                message: "Gửi Tin Nhắn Thành Công",
                data: savedMessage
            };
        
    }

    public async markAsRead(messageId: mongoose.Types.ObjectId) {
       
            const message = await DatabaseMessage.findByIdAndUpdate(
                messageId,
                { status: 'read' },
                { new: true }
            );

            if (!message) {
                return {
                    success: false,
                    message: "Không tìm thấy tin nhắn"
                };
            }

            return {
                success: true,
                message: "Đã đánh dấu tin nhắn đã đọc",
                data: message
            };
        
    }
}

export const messageService = MessageService.getInstance();
