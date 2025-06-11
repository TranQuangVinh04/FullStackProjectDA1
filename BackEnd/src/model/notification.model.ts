import mongoose from"mongoose";
import { Document, Types } from "mongoose";

//interface
export interface NatificationDocument extends Document{
    from:Types.ObjectId;
    to:Types.ObjectId;
    type:string;
    read:boolean;
    uniqueIdentifier:string;
}
//schema    
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
        enum:["follow","like","CreatePost","comment","deleteByAdmin"],

    },
    read:{
        type:Boolean,
        default:false,
    },
    uniqueIdentifier:{
        type:String,
        required:true,
        unique:true,
    },

},{timestamps:true});

//model
const notification = mongoose.model<NatificationDocument>("Notification",notificationSchema);

export default notification;