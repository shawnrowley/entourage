const express = require ("express");

const image = require("../middleware/image");
const postController = require("../controllers/post");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("",
  authenticate,
  image,
  postController.createPost
);

router.put(
  "/:id",
  authenticate,
  image,
  postController.updatePost
);

router.get("", postController.getPosts );

router.get("/:id", postController.getPostById);

router.delete("/:id", authenticate, postController.deletePost)

module.exports = router;
