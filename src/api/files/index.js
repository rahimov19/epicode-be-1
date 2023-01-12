import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  saveUsersAvatars,
  getUsers,
  writeUsers,
  getBlogs,
  writeBlogs,
  getBlogsJsonReadableStream,
} from "../../lib/fs-tools.js";
import { pipeline } from "stream";
import { createGzip } from "zlib";
import json2csv from "json2csv";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
const filesRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({ cloudinary, params: { folder: "users" } }),
}).single("avatar");

filesRouter.post(
  "/:postId/user",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const posts = await getBlogs();
      const index = posts.findIndex((post) => post.id === req.params.postId);
      if (index !== -1) {
        const oldPost = posts[index];
        const updatedPost = {
          ...oldPost,
          author: { ...oldPost.author, avatar: url },
          updatedAt: new Date(),
        };
        posts[index] = updatedPost;
        await writeBlogs(posts);
      }
      res.send("File uploaded");
    } catch (err) {
      next(err);
    }
  }
);
const cloudinaryUploader2 = multer({
  storage: new CloudinaryStorage({ cloudinary, params: { folder: "blogs" } }),
}).single("blog");
filesRouter.post(
  "/:postId/blog",
  cloudinaryUploader2,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      console.log(url);
      const posts = await getBlogs();
      console.log(req.params);
      const index = posts.findIndex((post) => post.id === req.params.postId);
      if (index !== -1) {
        const oldPost = posts[index];
        const updatedPost = { ...oldPost, cover: url, updatedAt: new Date() };
        posts[index] = updatedPost;
        await writeBlogs(posts);
      } else {
        console.log("jason Not updated");
      }
      res.send("File uploaded");
    } catch (err) {
      next(err);
    }
  }
);
filesRouter.get("/:postId/pdf", async (req, res, next) => {
  res.setHeader("Content-Disposition", "attachment; filename=test.pdf");
  const posts = await getBlogs();
  const index = posts.findIndex((post) => post.id === req.params.postId);
  if (index !== -1) {
    const blog = posts[index];
    console.log(blog);
    const source = await getPDFReadableStream(blog);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  }
});

filesRouter.get("/blogsCSV", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blogs.csv");
    const source = getBlogsJsonReadableStream();
    const transform = new json2csv.Transform({
      fields: ["author.name", "category", "title", "content"],
    });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});
export default filesRouter;
