import { Router } from "express";
import { sendMessageUser,getMessageUser,getMessageList } from "../controller/message.controller";
import { protectRoute } from "../middleware/protectroute";
import catchErrors  from "../utils/catchErrors";

const router = Router();

import { upload } from "../config/cloudinary";

router.post("/:id",catchErrors(protectRoute),upload.array("images",8),catchErrors(sendMessageUser));
router.get("/:id/messages",catchErrors(protectRoute),catchErrors(getMessageUser));
router.get("/get-list-message/:id",catchErrors(protectRoute),catchErrors(getMessageList));

export default router;
