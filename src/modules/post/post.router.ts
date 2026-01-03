import { Router } from "express";
import { PostController } from "./post.controller";

import { UserRole } from "../../middilewares/auth";
import auth from "../../middilewares/auth";

const router = Router();

router.get("/", PostController.getAllPost);
router.get("/:postId", PostController.getPostById);
router.post("/", auth(UserRole.USER), PostController.createPost);
export const postRouter = router;
