import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middilewares/auth";

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
    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;
    //     const page=Number(req.query.page??1);

    //     const limit=Number(req.query.limit??10);
    // const skip=(page-1)*limit;
    // console.log({page,limit,skip});
    // const sortBy=req.query.sortBy as string | undefined;
    // const sortOrder=req.query.sortOrder as string | undefined;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

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
      sortOrder,
    });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      error: "Post creation failed",
      details: err,
    });
  }
};
const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    // console.log(postId);
    if (!postId) {
      throw new Error("Post Id is required!");
    }
    const result = await postService.getPostByIdFromDB(postId);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Post retrieved failed!!!",
      details: e,
    });
  }
};
const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log({ user });
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    console.log({ user });
    const result = await postService.getMyPosts(user.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Post fetched failed",
      details: err,
    });
  }
};
const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await postService.updatePost(
      postId as string,
      req.body,
      user.id,
      isAdmin
    );
    res.status(200).json(result);
  } catch (err) {
    const errorMMessage =
      err instanceof Error ? err.message : "Post update failed!";

    res.status(400).json({
      error: errorMMessage,
      details: err,
    });
  }
};
export const PostController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
};
