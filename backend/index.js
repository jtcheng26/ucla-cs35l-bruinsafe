require("dotenv").config();

const { mongoose, UserModel, ReportModel } = require("./models.js");

const express = require("express");
const ip = require("ip");
const ipAddress = ip.address();
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { onConnect } = require("./socket.js");
io.on("connection", onConnect(io));

const port = process.env.PORT || 8080;

const { createHash } = require("crypto");

function hashpw(string) {
  return createHash("sha256").update(string).digest("hex");
}

/* ======================= Walk Routes ======================= */

const { walkRequest, walkAccept, getWalks, walkEnd } = require("./walk.js");

app.post("/walk/request", walkRequest);

app.post("/walk/accept", walkAccept);

app.post("/walk/end", walkEnd);

app.get("/walk/get", getWalks);

/* ======================= User Routes ======================= */

app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    res.send("Invalid ID", 400);
    return;
  }
  const model = await UserModel.findById(id).exec();
  if (model) {
    res.send(model.toJSON());
  } else res.send("User not found", 400);
});

app.post("/user/login", async (req, res) => {
  const email = req.body.email;
  const model = await UserModel.findOne({ email: email }).exec();
  if (!model) {
    res.status(400).json({ error: "User not found" });
  } else {
    if (!req.body.password) res.send("Invalid password", 400);
    const pw = hashpw(req.body.password);
    if (model.password != pw) {
      res.status(400).json({ error: "Wrong password" });
    } else {
      res.status(200).json(model.toJSON());
    }
  }
});

app.post("/user/create", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  if (!req.body.password) res.send("Invalid password", 400);
  const pw = hashpw(req.body.password);
  const model = new UserModel({ email: email, name: name, password: pw });
  model.save();
  res.send(model.toJSON());

  // UserModel.findOne( {$or: [{email: email}, { password: pw}] },
  //   (err, exisitingUser) => {

  //     if (err) {
  //       res.send("Internal Server Error", 500)
  //     }
  //     else if (existingUser)
  //     {
  //       if (existingUser.email == email){
  //         res.status(400).json({ error: "User with specified email already exists" });
  //       }
  //       else
  //         res.status(400).json({ error: "User with password already exists" });
  //     }
  //     else
  //     {
  //       const model = new UserModel({ email: email, name: name, password: pw });
  //       model.save();
  //       res.status(200).json(model.toJSON());
  //     }
  //   })
});

app.put("/user/edit", async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const pw = hashpw(req.body.password);

  if (!mongoose.isValidObjectId(id)) {
    res.send("Invalid ID", 400);
    return;
  }
  const model = await UserModel.findById(id);
  if (!model) {
    res.send("User not found", 404);
  } else if (model.password != pw) {
    res.send("Wrong password", 400);
  } else {
    await UserModel.findByIdAndUpdate(id, { name: name });
    res.send("Success", 200);
  }
});

app.get("/users/nearby", async (req, res) => {
  const users = await UserModel.find({});
  const jsonUsers = users.map((user) => {
    const json = user.toJSON();
    delete json["password"];
    return json;
  });
  res.send(jsonUsers);
});

/* ======================= Report Routes ======================= */

// only get reports within 0.1 latitude (~7mi radius)
const MAX_RADIUS = 0.1 * 0.1 + 0.1 * 0.1;

app.post("/report/search", async (req, res) => {
  const myLoc = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  };
  // optimize this for larger datasets in the future
  const all = await ReportModel.find({});
  const nearby = all.filter((report) => {
    //filter "nearby" report using distance formula per each report
    const reportLoc = report.get("location");
    const dx = Math.abs(myLoc.latitude - reportLoc.latitude);
    const dy = Math.abs(myLoc.longitude - reportLoc.longitude);
    return dx * dx + dy * dy <= MAX_RADIUS; //ISSUE: Need to square root of dx^2 + dy^2 to check radius
  });
  res.send(all); //ISSUE: Returns all Reports not nearby reports, Not sure if this is intended functionality
});

const REPORT_TYPES = [
  "Theft",
  "Assault",
  "Rape",
  "Abuse",
  "Kidnapping",
  "Stalking",
  "Hate Crime",
  "Indecent Exposure",
  "Drug Distribution",
  "Vandalism",
  "Solicitation",
  "Speeding",
];
app.post("/report/create", (req, res) => {
  const types = req.body.types;
  const timestamp = new Date();
  const description = req.body.description;
  const location = req.body.location;
  for (let type of types) {
    if (!REPORT_TYPES.includes(type)) {
      res.send("Invalid report type", 400);
      return;
    }
  }
  const model = new ReportModel({
    types: types,
    timestamp: timestamp,
    description: description,
    location: location,
  });
  model.save();
  res.send(model.toJSON());
});

/* ======================= Run App ======================= */

app.get("/healthz", (req, res) => {
  res.status(200).send("good");
});
server.listen(port, function () {
  console.log(`Listening on port ${port}`);
  console.log(`Network access via: ${ipAddress}:${port}!`);
});
