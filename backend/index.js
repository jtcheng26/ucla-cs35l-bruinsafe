require("dotenv").config();

const { mongoose, UserModel, ReportModel } = require("./models.js");

const express = require("express");
const app = express();
app.use(express.json());
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8080;

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
  const model = new UserModel({ email: email, name: name });
  model.save();
  res.send(model.toJSON());
});

/* ======================= Report Routes ======================= */

// only get reports within 0.1 latitude (~7mi radius)
const MAX_RADIUS = 0.1 * 0.1 + 0.1 * 0.1;

app.post("/report/search", async (req, res) => {
  const location = req.body.location
  console.log(location)
  // optimize this for larger datasets in the future
  const all = await ReportModel.find({});
  const nearby = all.filter((report) => {
    const loc = report.get("location");
    const dx = Math.abs(loc.latitude - location.latitude);
    const dy = Math.abs(loc.longitude - location.longitude);
    return dx * dx + dy * dy <= MAX_RADIUS;
  });
  res.send(nearby);
});

const REPORT_TYPES = ["suspicious", "danger", "violence"];
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
});
