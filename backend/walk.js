const { mongoose, UserModel, WalkModel } = require("./models");

/*

:/walk/request
user: userid
origin: orig coords
destination: dest coords

*/
const walkRequest = async (req, res) => {
  const user = req.body.user;
  const origin = req.body.origin;
  const dest = req.body.destination;
  const timeLeft = req.body.timeLeft ? req.body.timeLeft : 0;
  const model = await UserModel.findById(user).exec(); //check if user making walkRequest exists
  console.log(req.body);
  if (!mongoose.isValidObjectId(user)) {
    res.status(400).send("Invalid ID");
  } else if (!model) res.status(404).send("User not found");
  else {
    WalkModel.create;
    const walk = await WalkModel.findOneAndUpdate(
      { "user._id": user },
      {
        user: model,
        origin: origin,
        destination: dest,
        time_left: timeLeft,
        state: 0,
      },
      { upsert: true }
    );
    res.status(200).send(walk);
  }
};

/*

:/walk/accept
id: of walk coords
user: userid coords

*/
const walkAccept = async (req, res) => {
  const walkId = req.body.id;
  const userId = req.body.user;
  const walk = await WalkModel.findById(walkId).exec(); //check if walk exists
  const findUser = await UserModel.findById(userId).exec(); //check if guardian exists
  if (!findUser) {
    res.status(400).send("User not found");
  } else if (!walk) {
    res.status(400).send("Walk not found");
  } else if (userId == walk.user.id) {
    res.status(401).send("Guardian cannot be same as walker.");
  } else {
    walk.guardian = findUser;
    walk.state = 1;
    walk.save();
    res.send(walk.toJSON());
  }
};

const walkEnd = async (req, res) => {
  const walkId = req.body.id;
  const deleteRes = await WalkModel.findByIdAndDelete(walkId).exec(); //delete walk if it exists
  if (deleteRes) {
    res.send("Walk deleted successfully");
  } else res.status(400).send("Cannot delete nonexistent walk");
};

const getWalks = async (req, res) => {
  const walks = await WalkModel.find({}); //array of all WalkModels
  res.send(walks.map((w) => w.toJSON()));
};

module.exports = { walkRequest, walkAccept, getWalks, walkEnd };
