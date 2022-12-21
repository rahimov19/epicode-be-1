import express from "express";
import listEndpoints from "express-list-endpoints";
import blogsRouter from "./api/blogs/index.js";
import usersRouter from "./api/users/index.js";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHanlder,
  unauthorizedHandler,
} from "./errorHandlers.js";
import cors from "cors";

const server = express();

const port = 3001;

server.use(cors());
server.use(express.json());

server.use("/authors", usersRouter);
server.use("/blogs", blogsRouter);

server.use(badRequestHanlder);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port:", port);
});
