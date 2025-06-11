import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import {BAD_REQUEST,OK} from "../constants/http"
    interface DeletePostRequest {
        id?:string;
    }
    export const getUsers = async (req: Request, res: Response) => {
        const newId = req.userId.toString();
        const users = await adminService.getUsers(newId);
        if(users.success==true){
            return res.status(OK).json(users);
        }
        else{
            return res.status(BAD_REQUEST).json({
                success:false,
                message:users.message
            });
        }
        
    }
    export const changePasswordFromAdmin = async (req: Request<{},{},{password:string,userId:string}>, res: Response) => {
        const {userId,password} = req.body;
        const changePassword = await adminService.changePassword(userId,password);
        if(changePassword.success==true){
            return res.status(OK).json(changePassword);
        }
        else{
            return res.status(BAD_REQUEST).json({
                success:false,
                message:changePassword.message
            });
        }
    }
    export const banOrUnbanUser = async (req: Request<{},{},{userId:string}>, res: Response) => {
        const {userId} = req.body;
        const result = await adminService.banOrUnbanUser(userId);
        if(result.success==true){
            return res.status(OK).json({
                success:true,
                message:result.message
            });
        }
        else{
            return res.status(BAD_REQUEST).json({
                success:false,
                message:result.message
            });
        }
    }
    export const getReportHavior = async (req: Request, res: Response) => {
        const result = await adminService.getReportHavior();
        if(result.success==true){
            return res.status(OK).json(result);
        }
        else{
            return res.status(BAD_REQUEST).json({
                success:false,
                message:result.message
            });
        }
    }
    export const deletePostFromAdmin = async (req: Request<DeletePostRequest,{},{}>, res: Response) => {
        const {id} = req.params;
        if(!id){
            return res.status(BAD_REQUEST).json({
                success:false,
                message:"Không Có IdPost Được Cung Cấp"
            });
        }
        const result = await adminService.deletePost(id,req.userId.toString());
        if(result.success==true){
            return res.status(OK).json(result);
        }
        else{
            return res.status(BAD_REQUEST).json({
                success:false,
                message:result.message
            });
        }
    }
    export const deleteRpPost = async (req: Request<{id?:string},{},{}>, res: Response) => {
        const {id} = req.params;
        if(!id){
            return res.status(BAD_REQUEST).json({
                success:false,
                message:"Không Có IdPost Được Cung Cấp"
            });
        }
        const result = await adminService.deleteRpPost(id);
        if(result.success==true){
            return res.status(OK).json({
                success:true,
                message:result.message
            });
        }
        else{
            return res.status(BAD_REQUEST).json({
                success:false,
                message:result.message
            });
        }
    }