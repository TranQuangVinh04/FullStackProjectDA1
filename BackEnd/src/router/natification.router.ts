import { Router } from "express";
import catchErrors from "../utils/catchErrors";
import { protectRoute } from "../middleware/protectroute";
import { getNatification, readNatificationUser } from "../controller/natification.controller";


const routerNatification = Router();

routerNatification.get("/getNatification",catchErrors(protectRoute),catchErrors(getNatification));

routerNatification.patch("/readNatification/:id",catchErrors(protectRoute),catchErrors(readNatificationUser));

export default routerNatification;
