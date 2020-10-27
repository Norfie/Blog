require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
var _ = require('lodash');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://Jane_Maltseva:" + process.env.MONGODB_PASS + "@cluster0.xkqr6.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postsSchema = {
  title: String,
  body: String
};

const Post = mongoose.model("Post", postsSchema);

app.get("/posts/:postId", function(req, res) {

  const requestedPostId = req.params.postId;

  Post.findById(requestedPostId, function(err, foundList){
    res.render("post", {
       titleName: foundList.title,
       postTitle: foundList.title,
       postBody: foundList.body,
       postId: foundList._id
    });
  });
});

app.get("/redact/:postId", function(req, res) {

  const requestedPostId = req.params.postId;

  Post.findById(requestedPostId, function(err, foundList){
    res.render("redact", {
       titleName: foundList.title,
       postTitle: foundList.title,
       postBody: foundList.body,
       postId: foundList._id
    });
  });
});

app.get("/", function(req, res) {

  Post.find({}, function(err, foundItems) {
      res.render("home", {titleName: "Home", homeStartingContent: homeStartingContent, posts: foundItems});
    });

});

app.get("/about_me", function(req, res) {

  const titleName = "About me";

  res.render("about_me", {
    titleName: titleName,
    aboutContent: aboutContent
  });
});

app.get("/contact_me", function(req, res) {

  const titleName = "Contact me";

  res.render("contacts", {
    titleName: titleName,
    contactContent: contactContent
  });
});

app.route("/compose")

.get(function(req, res) {

  const titleName = "New post";

  res.render("compose", {
    titleName: titleName
  });
})

.post(function(req, res) {

  const post = new Post({
    title: req.body.newPostTitle,
    body: req.body.newPostText
  });

  post.save(function(err){
   if (!err){
     res.redirect("/");
   }
 });
});

app.post("/redact", function(req, res) {

  const requestedPostId = req.body.redactPostId;

  res.redirect("/redact/" + requestedPostId);

});

app.post("/save", function(req, res) {

const requestedPostId = req.body.redactedPostId;

Post.findByIdAndUpdate(requestedPostId, {title: req.body.redactedPostTitle, body: req.body.redactedPostText}, function(err){
  if (!err) {
    console.log("Successfully redacted checked item.");
    res.redirect("/posts/" + requestedPostId);
  }
});

});

app.post("/delete", function(req, res) {

  const requestedPostId = req.body.deletedPostId;

  Post.findByIdAndRemove(requestedPostId, function(err){
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
  });

});

app.listen(2500, function() {
  console.log("Server started on port 2500.");
});
