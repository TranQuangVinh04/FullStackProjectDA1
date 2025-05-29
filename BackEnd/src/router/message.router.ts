import { Router } from "express";
import { getUserId,sendMessageUser,getMessageUser } from "../controller/message.controller";
import { protectRoute } from "../middleware/protectroute";
import catchErrors  from "../utils/catchErrors";

const router = Router();

import { upload } from "../config/cloudinary";

router.get("/:id",catchErrors(protectRoute),catchErrors(getUserId));
router.post("/:id",catchErrors(protectRoute),upload.array("images",8),catchErrors(sendMessageUser));
router.get("/:id/messages",catchErrors(protectRoute),catchErrors(getMessageUser));

export default router;
