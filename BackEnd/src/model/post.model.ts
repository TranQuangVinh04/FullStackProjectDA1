import mongoose from"mongoose";
import { Document, Types } from "mongoose";

export interface Comment {
    text: string;
    user: Types.ObjectId;
  }
  
  export interface PostDocument extends Document {
    user: Types.ObjectId;
    text?: string;
    image?: string;
    likes: Types.ObjectId[];
    comment: Comment[];
    createdAt: Date;
    updatedAt: Date;
  }

const postSchema = new mongoose.Schema<PostDocument>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
    },
    image:{
        type:String
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    comment:[
        {
            text:{
                type:String,
                required:true,
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
        }
    ]
},{timestamps:true}
)
const PostDatabase = mongoose.model<PostDocument>("Post",postSchema);

export default PostDatabase;