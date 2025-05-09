import express from 'express';
import "dotenv/config"
import DB from "./config/DB"
import {v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cors from "cors"
import cookieParser from 'cookie-parser';
import {PORT,URL_ORIGIN} from "./constants/env"
import errorHandler from "./middleware/errorHandler"
import routerAuth from "./router/auth.router"
import routerPost from './router/post.router';
import bodyParser from 'body-parser';
const app = express();

app.use(
    cors(
        {
            origin:"http://localhost:5173",
            credentials:true,
        }
    )
)
app.use(bodyParser.json({ limit: "10mb" }));  
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));


app.use("/api/auth",routerAuth);
app.use("/api/post",routerPost);

app.use(errorHandler);
async function startServer (){
    await DB();
    app.listen(PORT,()=>{
        console.log(`Server Started With Port ${PORT}`);
        
    })
}
startServer();