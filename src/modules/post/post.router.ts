import { Router } from "express";
import { PostController } from "./post.controller";

import { UserRole } from "../../middilewares/auth";
import auth from "../../middilewares/auth";

const router = Router();

router.get("/", PostController.getAllPost);
router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPosts
);
router.get("/:postId", PostController.getPostById);
router.patch("/:postId",auth(UserRole.ADMIN,UserRole.USER), PostController.updatePost);

router.post("/", auth(UserRole.USER,UserRole.ADMIN), 
PostController.createPost);
export const postRouter = router;
