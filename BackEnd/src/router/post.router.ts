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
    getAllPostUsers,
    getFollowersUser,
    getFollwingsUser,
    getFollowingsPostUser,
    updatePostUser,
    searchPost,
} from "../controller/post.controller";

import { validatePost ,validateComment} from "../middleware/validation";

import { upload } from "../config/cloudinary";

routerPost.post("/create",catchErrors(protectRoute),upload.array("media",8),validatePost,catchErrors(createPostUser));

routerPost.delete("/delete/:id", catchErrors(protectRoute), catchErrors(deletePostUser));

routerPost.post("/comment/:id",catchErrors(protectRoute),validateComment,catchErrors(commentPostUser));

routerPost.post("/like/:id",catchErrors(protectRoute),catchErrors(likePostUser));

routerPost.get("/all",catchErrors(protectRoute),catchErrors(getAllPosts));

routerPost.get("/getAllPostUser/:username",catchErrors(protectRoute),catchErrors(getAllPostUsers));

routerPost.get("/getFollowerUser",catchErrors(protectRoute),catchErrors(getFollowersUser));

routerPost.get("/getFollwingsUser",catchErrors(protectRoute),catchErrors(getFollwingsUser));

routerPost.get("/getFollowingsPostUser",catchErrors(protectRoute),catchErrors(getFollowingsPostUser));

routerPost.put("/updatePostUser/:id",catchErrors(protectRoute),validatePost,catchErrors(updatePostUser));

routerPost.get("/search",catchErrors(protectRoute),catchErrors(searchPost));

export default routerPost;