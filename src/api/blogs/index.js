import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checkBlogsSchema, triggerBadRequest } from "./validator.js";
import { getBlogs, writeBlogs as postBlogs } from "../../lib/fs-tools.js";
import { sendVerificationEmail } from "../../lib/email-tools.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const blogsRouter = express.Router();

blogsRouter.post(
  "/",
  checkBlogsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    const blogsArray = await getBlogs();
    try {
      const newBlog = {
        ...req.body,
        createdAt: new Date(),
        id: uniqid(),
      };

      blogsArray.push(newBlog);
      await postBlogs(blogsArray);
      res.status(201).send({
        id: newBlog.id,
      });
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    if (req.query && req.query.category) {
      const filteredBlogs = blogsArray.filter(
        (blog) => blog.category === req.query.category
      );
      res.send(filteredBlogs);
    } else {
      res.send(blogsArray);
    }
  } catch (error) {
    next(error);
  }
});
blogsRouter.post("/email", async (req, res, next) => {
  try {
    const { email } = req.body;
    await sendVerificationEmail(email);
    res.send();
  } catch (error) {
    next(error);
  }
});
blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const blog = blogsArray.find((blog) => blog.id === req.params.blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(NotFound(`Blog with id ${req.params.blogId} is not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();

    const index = blogsArray.findIndex((blog) => blog.id === req.params.blogId);
    const oldBlog = blogsArray[index];
    const updatedBlog = {
      ...oldBlog,
      ...req.body,
      updatedAt: new Date(),
    };
    blogsArray[index] = updatedBlog;
    await postBlogs(blogsArray);
    res.send(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();

    const remainingBlogs = blogsArray.filter(
      (blog) => blog.id !== req.params.blogId
    );
    await postBlogs(remainingBlogs);
    res.send();
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
