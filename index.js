const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const { Server } = require('socket.io');
const path = require('path');

const io = new Server(server);


app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {

  console.log('a user connected');

  socket.on('user-connected', name =>{
    users[socket.id] = name;
    socket.broadcast.emit('user-joined-chat', name);
  })

  socket.on('chat message', message =>{
    console.log(users, users[socket.id])
    socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit("user-left-chat", users[socket.id])
    delete users[socket.id]
  });


});



server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});