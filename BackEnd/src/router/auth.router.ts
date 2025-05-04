import express from "express";
const routerAuth = express.Router();
import catchErrors from "../utils/catchErrors"
import {loginHandler,logoutHandler,getMeHandler,registerHandler} from "../controller/auth.Controller";
routerAuth.get("/login",catchErrors(loginHandler));
routerAuth.get("/register",catchErrors(registerHandler));
routerAuth.get("/logout",catchErrors(logoutHandler));
routerAuth.get("/getMe",catchErrors(getMeHandler));


export default routerAuth;