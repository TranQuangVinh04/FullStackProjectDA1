import express from "express";

const routerAuth = express.Router();

import catchErrors from "../utils/catchErrors"

import { protectRoute } from "../middleware/protectroute";

import {loginHandler,logoutHandler,getMeHandler,registerHandler} from "../controller/auth.controller";

routerAuth.post("/login",catchErrors(loginHandler));

routerAuth.post("/register",catchErrors(registerHandler));

routerAuth.post("/logout",catchErrors(logoutHandler));

routerAuth.get("/getMe",catchErrors(protectRoute),catchErrors(getMeHandler));

export default routerAuth;