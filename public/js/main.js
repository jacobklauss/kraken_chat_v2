var socket = io('http://jantschulev.ddns.net:3003');
// var socket = io('192.168.0.50:3003');

var send_button = document.getElementById('send_button');
var input = document.getElementById('message_input');
var main = document.getElementById('main');
var colorNames = ['orange', 'purple', 'green', 'red', 'blue', 'yellow'];
var colors = ['rgb(255, 180, 30)', 'rgb(255, 30, 255)', 'rgb(50, 255, 60)', 'rgb(255, 0, 0)', 'rgb(30, 180, 255)', 'rgb(255, 255, 0)'];
var text_commands = ['!help', '!change colour ', '!change name '];
var command_index = 0;
var name = Cookies.get('name');
if(name == "undefined"){
  name = prompt("What is you name?");
  Cookies.set('name', name);
}

var chat_color = Cookies.get('chat_color');
if(chat_color == undefined){
  chat_color = Math.floor(Math.random()*colors.length);
}
document.body.style.setProperty('--accent', colors[chat_color]);


socket.on('new_connected', function (m_array) {
  for (var i = 0; i < m_array.length; i++) {
    if(m_array[i].n == name){
      createMessage(true, m_array[i]);
    }else {
      createMessage(false, m_array[i]);
    }
  }
})
socket.on('new_message', function (m) {
  if (m.n == name) {
    createMessage(true, m);
  }else {
    createMessage(false, m);
  }
});

function send() {
  var message = input.value;
  input.value = "";
  if(!message.replace(/\s/g, '').length){return}

  if(message.charAt(0)=="!"){
    commands(message);
    return;
  }

  var message_object = {
    m: message,
    n: name,
    t: timeNow()
  }

  socket.emit("send", message_object);
  createMessage(true, message_object);
}

function commands(message) {
  var m = message;
  if(m.charAt(1)==" "){
    m = m.substr(2);
  }else{
    m = m.substr(1);
  }
  if(m.indexOf("change colour") == 0){
    var c = m.substr(14);
    for (var i = 0; i < colorNames.length; i++) {
      if(c == colorNames[i]){
        chat_color = i;
        Cookies.set("chat_color", chat_color);
        document.body.style.setProperty('--accent', colors[chat_color]);
        return;
      }
    }
  }
  if (m.indexOf("change name") == 0) {
    var newName = m.substr(12);
    name = newName;
    Cookies.set("name", name);
    window.location.reload();
  }
  if (m.indexOf("help") == 0) {
    setTimeout(function () {
      var message_object = {
        m: "The Kraken is here to help! Here's what you can do...",
        n: "kraken",
        t: timeNow()
      }
      socket.emit("send", message_object);
      createMessage(false, message_object);
    }, 400);
    setTimeout(function () {
      var message_object = {
        m: "You can click on a message to reveal who sent it and when.",
        n: "kraken",
        t: timeNow()
      }
      socket.emit("send", message_object);
      createMessage(false, message_object);
    }, 2400);
    setTimeout(function () {
      var message_object = {
        m: "type '! change colour [color]' to change theme.",
        n: "kraken",
        t: timeNow()
      }
      socket.emit("send", message_object);
      createMessage(false, message_object);
    }, 4400);
    setTimeout(function () {
      var message_object = {
        m: "You can choose from 6 colours: red, green, blue, orange, yellow and purple",
        n: "kraken",
        t: timeNow()
      }
      socket.emit("send", message_object);
      createMessage(false, message_object);
    }, 6400);
  }
}

function createMessage(colored, message_object) {
  var container = document.createElement("DIV");
  container.className = 'message_container';
  var info_container = document.createElement("DIV");
  info_container.className = 'message_container message_info_container';

  var info  = document.createElement("DIV");
  info.appendChild(document.createTextNode(message_object.n + " @ " + message_object.t));

  var div = document.createElement("DIV");
  if(colored){
    div.className = 'user_message message';
    info.className = "user_message_info message_info";
  }else {
    div.className = 'foreign_message message';
    info.className = "foreign_message_info message_info";
  }
  var t = document.createTextNode(message_object.m);
  div.appendChild(t);


  container.appendChild(div);
  info_container.appendChild(info);
  main.appendChild(container);
  main.appendChild(info_container);

  main.scrollTop = main.scrollHeight;
}

input.addEventListener('keydown', function () {
  if(event.which == 13){
    send();
  }
  if(event.which == 38){
    input.value = text_commands[command_index];
    command_index++;
    if(command_index >=3){
      command_index = 0;
    }
  }
  if(event.which == 40){
    input.value = text_commands[command_index];
    command_index--;
    if(command_index <= -1){
      command_index = 2;
    }
  }

})

function timeNow() {
  var d = new Date(),
      h = (d.getHours()<10?'0':'') + d.getHours(),
      m = (d.getMinutes()<10?'0':'') + d.getMinutes();
  return h + ':' + m;
}
