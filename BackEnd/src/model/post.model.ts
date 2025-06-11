// BackEnd/src/model/post.model.ts
import mongoose from 'mongoose';

//interface
export interface PostDocument extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    content: string;
    media: {
        url: string;
        type: 'image' | 'video';
    }[];
    likes: mongoose.Types.ObjectId[];
    comments: {
        user: mongoose.Types.ObjectId;
        text: string;
        createdAt: Date;
    }[];
    hashtags: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
//schema    
const postSchema = new mongoose.Schema<PostDocument>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID là bắt buộc']
    },
    content: {
        type: String,
        trim: true,
        maxlength: [1000, 'Nội dung không được vượt quá 1000 ký tự']
    },
    media: [{
        url: {
            type: String,
            required: [true, 'URL media là bắt buộc']
        },
        type: {
            type: String,
            enum: ['image', 'video'],
            required: [true, 'Loại media là bắt buộc']
        }
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID là bắt buộc']
        },
        text: {
            type: String,
            required: [true, 'Nội dung comment không được để trống'],
            trim: true,
            maxlength: [500, 'Comment không được vượt quá 500 ký tự']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    hashtags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hashtag',
        default: []
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//lấy số lượng likes
postSchema.virtual('likesCount').get(function() {
    return this.likes.length;
});

//lấy số lượng comments
postSchema.virtual('commentsCount').get(function() {
    return this.comments.length;
});

//tối ưu hóa tìm kiếm
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ content: 'text' });
postSchema.index({ hashtags: 1 });

//model
const Post = mongoose.model<PostDocument>('Post', postSchema);
export default Post;