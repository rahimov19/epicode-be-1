import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import listEndpoints from "express-list-endpoints";
import blogsRouter from "./api/blogs/index.js";
import usersRouter from "./api/users/index.js";
import filesRouter from "./api/files/index.js";
import { join } from "path";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHanlder,
  unauthorizedHandler,
} from "./errorHandlers.js";
import cors from "cors";
import createHttpError from "http-errors";

const publicFolderPath = join(process.cwd(), "./public");

const server = express();

const port = process.env.PORT;

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist`)
      );
    }
  },
};
server.use(express.static(publicFolderPath));
server.use(cors(corsOpts));
server.use(express.json());

server.use("/authors", usersRouter);
server.use("/blogs", blogsRouter);
server.use("/files", filesRouter);

server.use(badRequestHanlder);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port:", port);
});
