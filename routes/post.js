const express = require ("express");

const image = require("../middleware/image");
const s3 = require("../middleware/s3")
const postController = require("../controllers/post");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("",
  authenticate,
  s3,
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
