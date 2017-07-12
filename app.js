var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/client/index.html');
// });
app.use(express.static('client'));

io.on('connection', function(socket){
    socket.on('join', function(msg){
        var newId = game.addPlayer();
        socket.emit("addedSelf", newId);
    });
    socket.on('sendUpdate', function(msg){
        game.update(msg);
        socket.emit("gameInfo", game.getInfo(msg.id))
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

var Game = require('./server/game');
var game = new Game.Game();
