import mongoose from"mongoose";

//interface
export interface UserDocument extends mongoose.Document {
    username: string;
    fullname:string;
    password:string;
    email:string;
    role:string;
    followers:any;
    following:any;
    profileImg:string;
    link:string;
    converImg:string;
    likedPosts:any;
    createdAt:Date;
    updatedAt:Date;

}

//schema
const userSchema = new mongoose.Schema<UserDocument>({
    username:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },

    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        },

    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        },
        
    ],
    profileImg:{
        type:String,
        default:"http://localhost:3000/public/boy1.png",
    },
    converImg:{
        type:String,
        default:""
    },
    link:{
        type:String,
        default:""
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: [],
        },
    ],
},
{timestamps:true}
);

//model
const User = mongoose.model<UserDocument>("User",userSchema);

export default User;