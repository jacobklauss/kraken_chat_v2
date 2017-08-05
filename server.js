const PORT = 3003;
var fs = require('fs');
var express = require('express');
var app = express();
var server = app.listen(PORT,function () {
  console.log("kraken chat v2 server running on port: "+PORT);
});
app.use(express.static('public'));

var io = require('socket.io')(server);
var messages = [];

io.on('connection', function (socket) {
  socket.emit("new_connected", messages);
  socket.on('send', function (m) {
    messages.push(m);
    socket.broadcast.emit('new_message', m);
    saveChat();
  })
});

function saveChat () {
  var text = JSON.stringify(messages);
  fs.writeFile("chat.json", text, function(err) {
    if(err) {
      return console.log(err);
    }
  });
}
