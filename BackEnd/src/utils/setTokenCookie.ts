const jwt = require("jsonwebtoken");
import { Response } from "express";
import {JWT_SECRET}from "../constants/env"

export default async function setTokenCookie (userId:string|any,res:Response):Promise<void>{
    const token = jwt.sign({userId},JWT_SECRET,{expiresIn:"3d"});
    res.cookie("jwt",token,{
        maxAge:3*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development"
    })
}