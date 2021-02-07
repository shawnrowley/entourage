const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  console.log(req);
  const url = req.protocol + "://" + req.get("host");
  const post =  new Post({
    title : req.body.title,
    content: req.body.content,
    //imagePath: url + "/images/" + req.file.filename,
    imagePath: req.file.location,
    owner: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post : {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.image;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post =  new Post({
    _id: req.body.id,       // Need to add assignment of Mongoose will generate a new id causing update to fail
    title : req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    owner: req.userData.userId
  });

  Post.updateOne( {_id: req.params.id, owner: req.userData.userId }, post)
    .then(result =>{
      if (result.n > 0) {
        res.status(200).json({message: "Update successful"});
      } else {
        res.status(401).json({message: "Not Authorized"});
      }
    })
    .catch (error => {
      res.status(500).json({
        message: "Unable to update post"});
    })
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize; //+ Converts to numeric
  const page = +req.query.page;
  const postQuery = Post.find();
  let foundPosts;
  if (page && pageSize) {
    postQuery
      .skip(pageSize * (page -1))
      .limit(pageSize);
  }
  postQuery.find().then(posts => {
    foundPosts = posts;
    return Post.countDocuments();
   })
   .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfullly',
        posts: foundPosts,
        count: count
      });
   })
   .catch (error => {
      res.status(500).json({
        message: "Unable to get post"
      });
   })
}

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
  .then(post => {
    if (post) {
      res.status(200).json({
        message: 'Post fetched successfullly',
        post: post
      });
    } else {
      res.status(400).json({
        message: 'Post not found'
      });
    }
  })
  .catch (error => {
      res.status(500).json({
      message: "Unable to retrieve post"
    });
  });
}

exports.deletePost = (req, res) => {
  Post.deleteOne({ _id: req.params.id, owner: req.userData.userId })
  .then(result =>{
    if (result.n > 0) {
      res.status(200).json({message: "Delete successful"});
    } else {
      res.status(401).json({message: "Not Authorized"});
    }
  })
  .catch (error => {
    res.status(500).json({
      message: "Unable to delet post"
    });
  })
}
