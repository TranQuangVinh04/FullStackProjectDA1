import express from 'express';
import "dotenv/config"
import DB from "./config/DB"
import {v2 as cloudinary} from "cloudinary";
import cors from "cors"
import cookieParser from 'cookie-parser';
import {PORT,URL_ORIGIN} from "./constants/env"
import errorHandler from "./middleware/errorHandler"
import routerAuth from "./router/auth.router"

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(express.static("public"));
app.use(
    cors(
        {
            origin:URL_ORIGIN,
            credentials:true,
        }
    )
)


app.use("/api/auth",routerAuth);

app.use(errorHandler);
async function stratServer (){
    await DB();
    app.listen(PORT,()=>{
        console.log(`Server Started With Port ${PORT}`);
        
    })
}
stratServer();