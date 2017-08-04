const PORT = 3003;

var express = require('express');
var app = express();
var server = app.listen(PORT,function () {
  console.log("kraken chat v2 server running on port: "+PORT);
});
app.use(express.static('public'));

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.on('send', function (m) {
    socket.broadcast.emit('new_message', m);
  })
});
