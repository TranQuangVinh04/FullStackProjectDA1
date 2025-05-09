import express from "express";
const routerUser = express.Router();
import { 
    getProfile,
    setFollowOrUnfollow,
    changePasswordUser,
    updateFullNameUser,
    uploadImageProfileUser,
    uploadCoverImageUser,
    updateBioUser,

 } from "../controller/user.controller";

import { protectRoute } from "../middleware/protectroute";

import catchErrors from "../utils/catchErrors";

import {validateImageProfile} from "../middleware/validation";

import { upload } from "../config/cloudinary";

routerUser.get("/getProfile/:id",catchErrors(protectRoute),catchErrors(getProfile));

routerUser.post("/followOrUnfollow/:id",catchErrors(protectRoute),catchErrors(setFollowOrUnfollow));

routerUser.put("/changePassword",catchErrors(protectRoute),catchErrors(changePasswordUser));

routerUser.put("/updateProfile",catchErrors(protectRoute),catchErrors(updateFullNameUser));

routerUser.put("/uploadImageProfile",catchErrors(protectRoute),upload.single("image"),validateImageProfile,catchErrors(uploadImageProfileUser));

routerUser.put("/uploadCoverImage",catchErrors(protectRoute),upload.single("image"),validateImageProfile,catchErrors(uploadCoverImageUser));

routerUser.put("/updateBio",catchErrors(protectRoute),catchErrors(updateBioUser));

export default routerUser;
