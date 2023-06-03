const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATABASE_URL)
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect", err);
  });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/* Schema to represent Users */
const UserSchema = new Schema({
  id: ObjectId,
  email: String,
  name: String,
});

const ReportSchema = new Schema({
  type: String,
  timestamp: Date,
  description: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
});

const UserModel = mongoose.model("User", UserSchema);
const ReportModel = mongoose.model("Report", ReportSchema);

module.exports = { mongoose, UserModel, ReportModel };
