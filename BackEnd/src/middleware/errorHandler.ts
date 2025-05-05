import {ErrorRequestHandler,Request,Response} from "express"
import {INTERNAL_SERVER_ERROR,BAD_REQUEST} from "../constants/http"
import { z } from "zod"
const handlerZodError = (res: Response,error:z.ZodError) => {
    const errors = error.issues.map((e)=>({
        path:e.path.join("."),
        message:e.message,
    }))
    return res.status(BAD_REQUEST).json({
        message:error.message,
        errors,
    })
}

const errorHandler:ErrorRequestHandler = (error,req,res,next):any =>{
    console.log(`PATH ${req.path}`,error)
    if(error instanceof z.ZodError) return handlerZodError(res,error);
    return res.status(INTERNAL_SERVER_ERROR).json("Internal Server Error");
}

export default errorHandler