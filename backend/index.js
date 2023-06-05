require("dotenv").config();

const { mongoose, UserModel, ReportModel } = require("./models.js");

const express = require("express");
const ip = require('ip');
const ipAddress = ip.address();
const app = express();
app.use(express.json());
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8080;

const { createHash } = require('crypto')

function hashpw(string) {
  return createHash('sha256').update(string).digest('hex');
}

io.on("connection", (socket) => {
  socket.emit("connect", { message: "a new client connected" });
  socket.on("chat", (message) => {
    // console.log('From client: ', message)
    io.emit("chat", message);
  });

  socket.on("chat", (message) => {
    console.log("From server: ", message);
  });

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

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

app.post("/user/create", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const pw = hashpw(req.body.password)
  const model = new UserModel({ email: email, name: name, password: pw });
  model.save();
  res.send(model.toJSON());
});

app.put("/user/edit", async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const pw = hashpw(req.body.password)

  if (!mongoose.isValidObjectId(id)) {
    res.send("Invalid ID", 400);
    return;
  }
  const model = await UserModel.findById(id)
  if (!model) {
    res.send("User not found", 404)
  }
  else if (model.password != pw) {
    res.send("Wrong password", 400)
  } else {
    await UserModel.findByIdAndUpdate(id, { name: name })
    res.send("Success", 200)
  }
})

/* ======================= Report Routes ======================= */

// only get reports within 0.1 latitude (~7mi radius)
const MAX_RADIUS = 0.1 * 0.1 + 0.1 * 0.1;

app.post("/report/search", async (req, res) => {
  const myLoc = {
    latitude: req.body.latitude,
    longitude: req.body.longitude
  }
  // optimize this for larger datasets in the future
  const all = await ReportModel.find({});
  const nearby = all.filter((report) => {
    const reportLoc = report.get("location");
    const dx = Math.abs(myLoc.latitude - reportLoc.latitude);
    const dy = Math.abs(myLoc.longitude - reportLoc.longitude);
    return dx * dx + dy * dy <= MAX_RADIUS;
  });
  res.send(all);
});

const REPORT_TYPES = ["suspicious", "danger", "rape", "violence"];
app.post("/report/create", (req, res) => {
  const type = req.body.type;
  const timestamp = new Date();
  const description = req.body.description;
  const location = req.body.location;
  if (!REPORT_TYPES.includes(type)) {
    res.send("Invalid report type", 400);
    return;
  }
  const model = new ReportModel({
    type: type,
    timestamp: timestamp,
    description: description,
    location: location,
  });
  model.save();
  res.send(model.toJSON());
});

/* ======================= Run App ======================= */
server.listen(port, function () {
  console.log(`Listening on port ${port}`);
  console.log(`Network access via: ${ipAddress}:${port}!`);
});
