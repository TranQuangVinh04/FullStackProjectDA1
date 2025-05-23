import mongoose from "mongoose";

interface RepostBehaviorDocument extends mongoose.Document {
    post: mongoose.Types.ObjectId;
    text: string;
    uniqueIdentifier: string;
    problem: string;
    createdAt: Date;
    updatedAt: Date;
}

const repostBehaviorSchema = new mongoose.Schema<RepostBehaviorDocument>({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    text: {
        type: String,
        default: "",
    },
    problem: {
        type: String,
        required: true,
    },
    uniqueIdentifier: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const RepostBehaviorModel = mongoose.model<RepostBehaviorDocument>("RepostBehavior", repostBehaviorSchema);

export default RepostBehaviorModel;
