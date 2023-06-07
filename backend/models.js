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
  password: String // hash
});

const ReportSchema = new Schema({
  types: [String],
  timestamp: Date,
  description: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
});

const WalkSchema = new Schema({
  origin: {
    latitude: Number,
    longitude: Number
  },
  destination: {
    latitude: Number,
    longitude: Number
  },
  user: UserSchema,
  state: Number, // 0 = started, 1 = in progress, 2 = finished
  guardian: UserSchema
})

const UserModel = mongoose.model("User", UserSchema);
const ReportModel = mongoose.model("Report", ReportSchema);
const WalkModel = mongoose.model("Walk", WalkSchema)

module.exports = { mongoose, UserModel, ReportModel, WalkModel };
