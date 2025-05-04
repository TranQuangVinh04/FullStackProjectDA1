import {Request,Response} from "express";
export async function loginHandler(req:Request,res:Response,) {
    res.send("Hello EveryOne")
}
export async function registerHandler(req:Request,res:Response,) {
    res.send("Hello EveryOne")
}
export async function logoutHandler(req:Request,res:Response,) {
    res.send("Hello EveryOne")
}
export async function getMeHandler(req:Request,res:Response,) {
    throw new Error("ABC")
}