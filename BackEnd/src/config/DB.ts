import mongoose from "mongoose";
import {MONGO_URL} from "../constants/env"
async function DB(){
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected Database");
    } catch (error) {
        console.log("Error Connect Database",error);
        process.exit(1);
    }
}
export default DB;