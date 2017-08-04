var socket = io('localhost:3003');
var send_button = document.getElementById('send_button');
var input = document.getElementById('message_input');
var main = document.getElementById('main');

socket.on('new_message', function (m) {
  recieve(m);
})

function recieve(message) {
  var container = document.createElement("DIV");
  container.className = 'message_container';
  var div = document.createElement("DIV");
  div.className = 'foreign_message message';
  var t = document.createTextNode(message);
  div.appendChild(t);
  container.appendChild(div);
  main.appendChild(container);
}


function send() {
  var message = input.value;
  if(message==''){return}
  socket.emit("send", message);

  var container = document.createElement("DIV");
  container.className = 'message_container';
  var div = document.createElement("DIV");
  div.className = 'user_message message';
  var t = document.createTextNode(message);
  div.appendChild(t);
  container.appendChild(div);
  main.appendChild(container);
  input.value = "";
}

input.addEventListener('keydown', function () {
  if(event.which == 13){
    send();
  }
})
