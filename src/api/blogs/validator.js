import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is mandatory field and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Title is mandatory field and needs to be a string!",
    },
  },
};

export const checkBlogsSchema = checkSchema(blogSchema);
export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during book validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
