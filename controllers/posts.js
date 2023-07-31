const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe");



module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFavorites: async (req, res) => {
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const favPost = await Favorite.find({ user: req.user.id }).populate('post');

      // console.log('favPost:', favPost)

      //Sending post data from mongodb and user data to ejs template
      res.render("favorites.ejs", { favPost: favPost, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ post: req.params.id }).populate('user').sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comment: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  favoriteRecipe: async (req, res) => {
    try {
      // Find the post to be favorited
      const post = await Post.findById(req.params.id);

      if (!post) {
        // Post not found, handle the error or send an appropriate response
        return res.status(404).json({ message: "Post not found" });
      }

      // Create a favorite object using data from the post
      const favorite = new Favorite({
        favPost: post._id,
        title: post.title, // Add the title from the post
        image: post.image, // Add the image from the post
        user: req.user._id,
      });

      // Save the favorite
      await favorite.save();

      console.log("Favorite has been added!");
      res.redirect("/post/" + post._id);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  },

  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  deleteFavorite: async (req, res) => {
    try {
      // Find the favorite entry by id
      const favorite = await Favorite.findById(req.params.id);

      if (!favorite) {
        console.log("Favorite not found");
        res.redirect("/favorites");
        return;
      }

      // Delete the favorite entry
      await favorite.remove();
      console.log("Deleted Favorite");
      res.redirect("/favorites");
    } catch (err) {
      console.log(err);
      res.redirect("/favorites");
    }
  },
};
