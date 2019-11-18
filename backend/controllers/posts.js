const Post = require('../models/post');

exports.createPost = (req,res,next) => {
  // create a database object
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  // will save in the database
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      // using ...createdPost, it will create a object with all the properties of createdPost, then you can add new properties
      post : {
        ...createdPost,
        id : createdPost._id,
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    });
  });
}

exports.modifyPost = (req,res,next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
   const url = req.protocol + '://' + req.get("host");
   imagePath = url + "/images/" + req.file.filename;
  }
 const post = new Post({
   _id: req.body.id,
   title: req.body.title,
   content: req.body.content,
   imagePath: imagePath,
   creator: req.userData.userId
 });
 console.log("Update post",post);
 // The update will fail if the creatorid is not the same as the creator id of the post.
 Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
 .then(result => {
   console.log("Result of update post",result);
   if(result.nModified > 0){
     res.status(200).json({ message : 'Update sucessfull!'});
   }else{
     // If n > 0 then we find our post, but we save it without modifying it first.
     if(result.n > 0){
      res.status(200).json({ message : 'Update sucessfull!'});
     }else{
       // In this case, we did'nt find the post.
      res.status(401).json({ message : 'Not authorized!'});
     }
   }

 })
 .catch(error => {
   res.status(500).json({
     message: "Couldn't update post!"
   });
 });
}

exports.readPosts = (req, res, next) => {
  const pageSize = + req.query.pagesize; // using + will convert the string to a number
  const currentPage = req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  // If these parameter are defined and contains value
  if(pageSize && currentPage){
    postQuery
    .skip(pageSize * (currentPage - 1))// skip the previous page
    .limit(pageSize); // limit the number of item returned
  }
  postQuery
  .then(documents => {
    fetchedPosts = documents;
    return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Post fetched sucessfully!',
        posts: fetchedPosts,
        maxPosts: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching posts failed"
    });
  });
}

exports.readOnePost = (req,res, next) => {
  Post.findById(req.params.id).then( post => {
    if(post) {
      res.status(200).json(post);
    }else{
      res.status(404).json({message: 'Post not found'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed"
    });
  });
}

exports.deletePost = (req,res, next) => {
  Post.deleteOne( {_id: req.params.id, creator: req.userData.userId}).then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({ message : 'Post deleted!'});
    }else{
      res.status(401).json({ message : 'Not authorized!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Deleting post failed"
    });
  });;
}
