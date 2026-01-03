import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    // console.log(req.user);
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized",
      });
    }
    const result = await postService.createPost(req.body, req.user.id);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Post creation failed",
      details: err,
    });
  }
};
const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    // console.log("Search value: ", search);

    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;
    // console.log({ isFeatured });
    const status=req.query.status as PostStatus | undefined;
    const authorId=req.query.authorId as string | undefined;
    const page=Number(req.query.page??1);
    
    const limit=Number(req.query.limit??10);
const skip=(page-1)*limit;
console.log({page,limit,skip});
const sortBy=req.query.sortBy as string | undefined;
const sortOrder=req.query.sortOrder as string | undefined;

    const result = await postService.getAllPostFromDB({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      error: "Post creation failed",
      details: err,
    });
  }
};
export const PostController = {
  createPost,
  getAllPost,
};
