import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  saveUsersAvatars,
  getUsers,
  writeUsers,
  getBlogs,
} from "../../lib/fs-tools.js";
import { pipeline } from "stream";
import { createGzip } from "zlib";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
const filesRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({ cloudinary, params: { folder: "users" } }),
}).single("avatar");

filesRouter.post("/:userId", cloudinaryUploader, async (req, res, next) => {
  try {
    const url = req.file.path;
    const users = await getUsers();
    const index = users.findIndex((user) => user.id === req.params.userId);
    if (index !== -1) {
      const oldUser = users[index];
      const author = { ...oldUser.author, avatar: url };
      const updatedUser = { ...oldUser, author, updateAt: new Date() };
      users[index] = updatedUser;
      await writeUsers(users);
    }
    res.send("File uploaded");
  } catch (error) {
    next(error);
  }
});
const cloudinaryUploader2 = multer({
  storage: new CloudinaryStorage({ cloudinary, params: { folder: "blogs" } }),
}).single("blog");
filesRouter.post("/:postid", cloudinaryUploader2, async (req, res, next) => {
  try {
    const url = req.file.path;
    const posts = await getPosts();
    const index = posts.findIndex((post) => post.id === req.params.postid);
    if (index !== -1) {
      const oldPost = posts[index];
      const updatedPost = { ...oldPost, cover: url, updatedAt: new Date() };
      posts[index] = updatedPost;
      await writePosts(posts);
    }
    res.send("File uploaded");
  } catch (err) {
    next(err);
  }
});
filesRouter.get("/pdf", async (req, res, next) => {
  res.setHeader("Content-Disposition", "attachment; filename=test.pdf");
  const blogsArr = await getBlogs();
  console.log(blogsArr);
  const source = await getPDFReadableStream(blogsArr);
  const destination = res;
  pipeline(source, destination, (err) => {
    if (err) console.log(err);
  });
});
export default filesRouter;
