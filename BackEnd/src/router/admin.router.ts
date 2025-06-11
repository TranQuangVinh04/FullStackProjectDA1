import { Router } from "express";
import { protectRouteAdmin } from "../middleware/protectroute";
import catchErrors from "../utils/catchErrors";
import {banOrUnbanUser, changePasswordFromAdmin, deletePostFromAdmin, deleteRpPost, getReportHavior, getUsers} from "../controller/admin.controller";
const adminRouter = Router();

adminRouter.get("/users",catchErrors(protectRouteAdmin),catchErrors(getUsers));
adminRouter.put("/change-password",catchErrors(protectRouteAdmin),catchErrors(changePasswordFromAdmin));
adminRouter.put("/ban-unban",catchErrors(protectRouteAdmin),catchErrors(banOrUnbanUser));
adminRouter.get("/report-havior",catchErrors(protectRouteAdmin),catchErrors(getReportHavior));
adminRouter.delete("/delete-post/:id",catchErrors(protectRouteAdmin),catchErrors(deletePostFromAdmin));
adminRouter.delete("/delete-rp-havior/:id",catchErrors(protectRouteAdmin),catchErrors(deleteRpPost));
export default adminRouter;