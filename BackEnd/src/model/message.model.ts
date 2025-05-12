import mongoose from "mongoose";

export interface MessageDocument extends Document{
    senderId:mongoose.Types.ObjectId,
    receiverId:mongoose.Types.ObjectId,
    text:string,
    image:{
        url: string;
        type: 'image';
    }[],
    status:{
        type:string,
        enum:["read","unread"],
        default:"unread"
    },
    createdAt:Date,
    updatedAt:Date
}

const messageSchema = new mongoose.Schema<MessageDocument>({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String
    },
    image:[
        {
            url:{
                type:String
            },
            type:{
                type:String,
                enum:["image"]
            }
        }
    ],
    status:{
        type:String,
        enum:["read","unread"],
        default:"unread"
    }
},{timestamps:true});

const message = mongoose.model<MessageDocument>("Message",messageSchema);

export default message;
