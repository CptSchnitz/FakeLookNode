const express = require("express");
const api = express.Router({ mergeParams: true });
const postController = require("./../../controllers/posts.controller");

api.get("/Posts", postController.GetPosts);

module.exports = api;