import {Request , Response , NextFunction} from "express"
import handleError from "./handleError"
type asyncController = (
    req:Request,
    res:Response,
    next:NextFunction
) =>Promise<any>;

const catchErrors = (controller:asyncController):asyncController=>{
    return async (req,res,next) =>{
        try {
            await controller(req,res,next);
        } catch (error) {
           
            next(error);
        }
    } 
}
export default catchErrors;