import mongoose from 'mongoose';

// Interface cho Hashtag document
export interface HashtagDocument extends mongoose.Document {
    name: string;
    posts: mongoose.Types.ObjectId[];
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

// Schema cho Hashtag
const hashtagSchema = new mongoose.Schema<HashtagDocument>({
    name: {
        type: String,
        required: [true, 'Tên hashtag là bắt buộc'],
        unique: true,
        trim: true,
        lowercase: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: []
    }],
    count: {
        type: Number,
        default: 0 // Số lượng post sử dụng hashtag này
    }
}, {
    timestamps: true
});

// Index để tối ưu tìm kiếm
hashtagSchema.index({ name: 1 });
hashtagSchema.index({ count: -1 });

const Hashtag = mongoose.model<HashtagDocument>('Hashtag', hashtagSchema);

export default Hashtag; 