import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    // console.log(req.user);
    if(!req.user){
      return res.status(400).json({
      error: "Unauthorized",
      
    });
    }
    const result = await postService.createPost(req.body,req.user.id);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Post creation failed",
      details: err,
    });
  }
};
const getAllPost=async(req: Request, res: Response)=>{
  try {
    const result = await postService.getAllPostFromDB();
    res.status(200).json(result);
  } catch (err:any) {
    res.status(400).json({
      error: "Post creation failed",
      details: err,
    });
  }
}
export const PostController = {
  createPost,
  getAllPost
};
