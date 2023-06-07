const onConnect = (io) => (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });

  socket.on("update", (room_id, location) => {
    io.to(room_id).emit("loc", location);
    if (!location) return
    console.log(`⚡: ${socket.id} shared their location to ${room_id}! ------- ${location.latitude}, ${location.longitude}`);
  });

  socket.on("join", (room_id) => {
    console.log(`⚡: ${socket.id} joined room ${room_id}!`);
    socket.join(room_id);
  });

  socket.on("start", (id) => {
    console.log(id)
    console.log(`⚡: ${socket.id} created room ${id}!`);
    socket.join(id);
    // TODO: update state of walk
  });

  socket.on("end", (id) => {
    // TODO: update state of walk
    io.to(id).emit("end");
    socket.leave(id)
    console.log(`⚡: ${socket.id} closed room ${id}!`);
  });
};

module.exports = { onConnect };
