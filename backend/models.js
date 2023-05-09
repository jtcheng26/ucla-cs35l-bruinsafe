const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATABASE_URL)
  .then((res) => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("Failed to connect", err);
  });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/* Schema to represent ... */
const BlogPostSchema = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  date: Date,
});

/* Schema to represent ... */
const Schema2 = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  date: Date,
});

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
const BlogPost2 = mongoose.model("BlogPost2", Schema2);

module.exports = { mongoose, BlogPost, BlogPost2 };
