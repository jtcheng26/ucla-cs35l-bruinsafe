require("dotenv").config();

const { mongoose, UserModel } = require("./models.js");

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

app.get("/user/:id", async (req, res) => {
  const id = req.params.id
  if (!mongoose.isValidObjectId(id)) {
    res.send("Invalid ID", 400)
    return
  }
  const model = await UserModel.findById(id).exec()
  if (model) {
    res.send(model.toJSON())
  } else
  res.send("User not found", 400);
});

app.post("/user/create", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const model = new UserModel({ email: email, name: name });
  model.save();
  res.send(model.toJSON());
});
server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
