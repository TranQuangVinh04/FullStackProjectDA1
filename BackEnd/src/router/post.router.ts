import express from "express";

const routerPost = express.Router();

import catchErrors from "../utils/catchErrors"

import { protectRoute } from "../middleware/protectroute";

import {
    createPostUser ,
    deletePostUser ,
    commentPostUser , 
    likePostUser ,
    getAllPosts ,
    getAllLikePostUser ,
    getAllPostUsers,
    getFollowersUser,
    getFollwingsUser,
    getFollowingsPostUser,
    getUpdatePostUser,
    updatePostUser,
} from "../controller/post.controller";

import { validatePost ,validateComment} from "../middleware/validation";

import { upload } from "../config/cloudinary";

routerPost.post("/create",catchErrors(protectRoute),upload.array("media",8),validatePost,catchErrors(createPostUser));

routerPost.delete("/delete/:id", catchErrors(protectRoute), catchErrors(deletePostUser));

routerPost.post("/comment/:id",catchErrors(protectRoute),validateComment,catchErrors(commentPostUser));

routerPost.post("/like/:id",catchErrors(protectRoute),catchErrors(likePostUser));

routerPost.get("/all",catchErrors(getAllPosts));

routerPost.get("/all/like",catchErrors(getAllLikePostUser));

routerPost.get("/all/user",catchErrors(getAllPostUsers));

routerPost.get("/getFollowerUser",catchErrors(getFollowersUser));

routerPost.get("/getFollwingsUser",catchErrors(getFollwingsUser));

routerPost.get("/getFollowingsPostUser",catchErrors(getFollowingsPostUser));

routerPost.get("/getUpdatePostUser/:id",catchErrors(protectRoute),catchErrors(getUpdatePostUser));

routerPost.put("/updatePostUser/:id",catchErrors(protectRoute),validatePost,catchErrors(updatePostUser));

export default routerPost;