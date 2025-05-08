import mongoose from"mongoose";
import { Document, Types } from "mongoose";


export interface NatificationDocument extends Document{
    from:Types.ObjectId;
    to:Types.ObjectId;
    type:string;
    read:boolean;
}
const notificationSchema = new mongoose.Schema<NatificationDocument>({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    type:{
        type:String,
        required:true,
        enum:["folow","like","FollowingCreatePost"],

    },
    
    read:{
        type:Boolean,
        default:false,
    },
},{timestamps:true});

const notification = mongoose.model<NatificationDocument>("Notification",notificationSchema);

export default notification;