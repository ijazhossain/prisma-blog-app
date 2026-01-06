import { Request, Response } from "express";
import { commentServices } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentServices.createComment(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Comment creation failed",
      details: err,
    });
  }
};
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentServices.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Single comment do not retrieved",
      details: err,
    });
  }
};
const getCommentsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentServices.getCommentsByAuthor(
      authorId as string
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "No comment retrieved for this author",
      details: err,
    });
  }
};
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const { commentId } = req.params;
    const result = await commentServices.deleteComment(
      commentId as string,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Comment do not delete",
      details: err,
    });
  }
};
const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentServices.updateComment(
      commentId as string,
      req.body,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: "Comment update failed!",
      details: e,
    });
  }
};
const moderateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentServices.moderateComment(
      commentId as string,
      req.body
    );
    res.status(200).json(result);
  } catch (err) {
    const errorMMessage =
      err instanceof Error
        ? err.message
        : "Admin Comment status update failed!";

    res.status(400).json({
      error: errorMMessage,
      details: err,
    });
  }
};

export const commentController = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
  
};
