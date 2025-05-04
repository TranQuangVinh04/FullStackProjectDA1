import {Request , Response , NextFunction} from "express"
import handleError from "./handleError"
type asyncController = (
    req:Request,
    res:Response,
    next:NextFunction
) =>Promise<any>;

const catchErrors = (controller:asyncController):asyncController=>
    async (req,res,next) =>{
        try {
            await controller(req,res,next);
        } catch (error) {
            handleError(error,req.path);
            next(error);
        }
    } 
export default catchErrors;