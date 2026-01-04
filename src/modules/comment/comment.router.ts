import { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middilewares/auth";

const router = Router();

router.get(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.getCommentById
);
router.get(
  "/author/:authorId",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.getCommentsByAuthor
);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);
router.delete("/:commentId", auth(UserRole.USER,UserRole.ADMIN),
commentController.deleteComment)
export const commentRouter: Router = router;
