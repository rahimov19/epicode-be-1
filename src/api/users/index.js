import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const usersRouter = express.Router();

const usersJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "users.json"
);

usersRouter.post("/authors", (req, res) => {
  const newUser = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
  };

  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));
  usersArray.push(newUser);
  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray));
  res.status(201).send({
    id: newUser.id,
  });
});

usersRouter.post("/authors/checkEmail", (req, res) => {
  const emailToCheck = req.body.email;

  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));
  usersArray.find((user) => user.email === emailToCheck)
    ? res.status(201).send("email is already used")
    : res.status(201).send("email is not used");
});

usersRouter.get("/authors", (req, res) => {
  const fileContentAsABuffer = fs.readFileSync(usersJSONPath);
  const usersArray = JSON.parse(fileContentAsABuffer);
  res.send(usersArray);
});

usersRouter.get("/authors/:userId", (req, res) => {
  const userId = req.params.userId;
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));
  const foundUser = usersArray.find((user) => user.id === userId);
  res.send(foundUser);
});

usersRouter.put("/authors/:userId", (req, res) => {
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));
  const index = usersArray.findIndex((user) => user.id === req.params.userId);
  const oldUser = usersArray[index];
  const updatedUser = {
    ...oldUser,
    ...req.body,
    updatedAt: new Date(),
  };
  usersArray[index] = updatedUser;
  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray));
  res.send(updatedUser);
});

usersRouter.delete("/authors/:userId", (req, res) => {
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));
  const remainingUsers = usersArray.filter(
    (user) => user.id !== req.params.userId
  );
  fs.writeFileSync(usersJSONPath, JSON.stringify(remainingUsers));
  res.send();
});

export default usersRouter;
