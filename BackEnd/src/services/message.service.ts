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
    public async getMessageList(userId: mongoose.Types.ObjectId) {
        // Lấy tin nhắn cuối cùng của mỗi cuộc trò chuyện
        const listMessage = await DatabaseMessage.aggregate([
            // Tìm tất cả tin nhắn liên quan đến userId
            {
                $match: {
                    $or: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                }
            },
            // Sắp xếp theo thời gian mới nhất
            {
                $sort: { createdAt: -1 }
            },
            // Nhóm theo cặp người nhắn tin
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$senderId", userId] },
                            then: "$receiverId",
                            else: "$senderId"
                        }
                    },
                    // Lấy tin nhắn đầu tiên sau khi sort (tức là tin nhắn mới nhất)
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            // Thay thế document bằng tin nhắn cuối
            {
                $replaceRoot: { newRoot: "$lastMessage" }
            }
        ]).exec();

        // Populate thông tin người dùng
        const populatedMessages = await DatabaseMessage.populate(listMessage, [
            {
                path: 'senderId',
                select: 'username fullname profileImg _id'
            },
            {
                path: 'receiverId',
                select: 'username fullname profileImg _id'
            }
        ]);

        return {
            success: true,
            message: "Lấy Danh Sách Tin Nhắn Thành Công",
            data: populatedMessages
        };
    }
}



export const messageService = MessageService.getInstance();
