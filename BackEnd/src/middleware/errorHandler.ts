import {ErrorRequestHandler} from "express"
import {INTERNAL_SERVER_ERROR} from "../constants/http"
const errorHandler:ErrorRequestHandler = (error,req,res,next):any =>{
    console.log(`PATH ${req.path}`,error)
    return res.status(INTERNAL_SERVER_ERROR).json("Internal Server Error");
}

export default errorHandler