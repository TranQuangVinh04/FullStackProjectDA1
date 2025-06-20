import express from "express";
const routerUser = express.Router();
import { 
    getProfile,
    setFollowOrUnfollow,
    changePasswordUser,
    uploadImageProfileUser,
    updateProfileUs,
    searchUsers,
    getSuggestionUser,
    getHashtags,
 } from "../controller/user.controller";

import { repostPost } from "../controller/post.controller";

import { protectRoute } from "../middleware/protectroute";

import catchErrors from "../utils/catchErrors";

import {validateImageProfile} from "../middleware/validation";

import { upload } from "../config/cloudinary";

routerUser.get("/getProfile/:username",catchErrors(protectRoute),catchErrors(getProfile));

routerUser.put("/changePassword",catchErrors(protectRoute),catchErrors(changePasswordUser));

routerUser.post("/followOrUnfollow/:id",catchErrors(protectRoute),catchErrors(setFollowOrUnfollow));

routerUser.post("/repostPost/:id",catchErrors(protectRoute),catchErrors(repostPost));

routerUser.put("/uploadImageProfile",catchErrors(protectRoute),upload.single("image"),validateImageProfile,catchErrors(uploadImageProfileUser));

routerUser.put("/updateProfile",catchErrors(protectRoute),upload.single("image"),catchErrors(updateProfileUs));

routerUser.get("/search",catchErrors(protectRoute),catchErrors(searchUsers));

routerUser.get("/suggestion",catchErrors(protectRoute),catchErrors(getSuggestionUser));

routerUser.get("/hashtags",catchErrors(protectRoute),catchErrors(getHashtags));

export default routerUser;
