import express from "express";
const routerPost = express.Router();
import catchErrors from "../utils/catchErrors"
import { protectRoute } from "../middleware/protectroute";
import { commentPostUser, createPostUser, deletePostUser ,likePostUser} from "../controller/post.controller";

routerPost.post("/create",catchErrors(protectRoute),catchErrors(createPostUser))
routerPost.delete("/delete/:id", catchErrors(protectRoute), catchErrors(deletePostUser));
routerPost.post("/comment/:id",catchErrors(protectRoute),catchErrors(commentPostUser));
routerPost.post("/like/:id",catchErrors(protectRoute),catchErrors(likePostUser));
export default routerPost;