import mongoose from "mongoose";

export interface GoogleUserDocument extends Document{
    accessToken:object;
    refreshToken:object;
    profile:object;
}

const SchemaGoogle = new mongoose.Schema<GoogleUserDocument>({
    accessToken:{
        type:Object
    },
    refreshToken:{
        type:Object
    },
    profile:{
        type:Object
    }
})
const googleUser = mongoose.model<GoogleUserDocument>("GoogleUser",SchemaGoogle);

export default googleUser;