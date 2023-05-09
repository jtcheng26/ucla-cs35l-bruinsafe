require("dotenv").config();

const { mongoose, BlogPost } = require("./models.js");

const app = require("express")();
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

app.get("/", (req, res) => {
  new BlogPost({ title: "title", body: "body", date: new Date() }).save();
  res.send("Hello World!")
});
server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
