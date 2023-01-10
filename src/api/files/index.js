import express from "express";
import multer from "multer";
import { extname } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { saveUsersAvatars, getUsers, writeUsers } from "../../lib/fs-tools.js";

const filesRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({ cloudinary, params: { folder: "users" } }),
}).single("avatar");

filesRouter.post(
  "/:userId/single",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      // const originalFileExtensioin = extname(req.file.originalname);
      // const fileName = req.params.userId + originalFileExtensioin;

      // await saveUsersAvatars(fileName, req.file.buffer);
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
  }
);

export default filesRouter;
