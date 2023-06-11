//Socket Connections (TCP/UDP) & Room Management (walk joining)

//socket connection handler
const onConnect = (io) => (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

//disconnection handler
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });

  //update event handler
  socket.on("update", (room_id, location) => {
    io.to(room_id).emit("loc", location); //emit even to all all rooms w/ specificed room_id 
    if (!location) return
    console.log(`⚡: ${socket.id} shared their location to ${room_id}! ------- ${location.latitude}, ${location.longitude}`);
  });

  //join room event handler
  socket.on("join", (room_id) => {
    console.log(`⚡: ${socket.id} joined room ${room_id}!`);
    socket.join(room_id); //handles socket actually joining room
  });

  socket.on("start", (id) => {
    console.log(id)
    console.log(`⚡: ${socket.id} created room ${id}!`);
    socket.join(id);
    // TODO: update state of walk
  });

  socket.on("end", (id) => {
    // TODO: update state of walk
    io.to(id).emit("end"); //emit end to all sockets w/ specific room id
    socket.leave(id)
    console.log(`⚡: ${socket.id} closed room ${id}!`);
  });
};

module.exports = { onConnect };
