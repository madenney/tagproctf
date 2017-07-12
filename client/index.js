

function Game() {

    var board = document.getElementById("game-area").getContext("2d");
    var boardWidth = $("#game-area").css("width").slice(0,-2);
    var boardHeight = $("#game-area").css("height").slice(0,-2);
    var player;
    var otherPlayers = [];
    var keysArray;

    this.addClientPlayer = function(id) {
        console.log("Game Object: addPlayer()")
        // Get Random coordinates somewhere inside the box
        var x = (Math.random() * (boardWidth - 200)) + 80;
        var y = (Math.random() * (boardHeight - 200)) + 80;

        player = new Player(x,y, id);
        player.draw(board);

    };

    this.beginPolling = function(socket) {
        var count = 0;
        setInterval(function() {
            player.accelerate(keysArray);
            var info = player.drawNext(board);
            socket.emit("sendUpdate", info);
        }, 50);
    };

    this.recieveUpdate = function(info) {
        board.clearRect(0,0,boardWidth, boardHeight);
        player.drawNext(board);
        for(var i = 0; i < info.length; i++) {
            for(var j = 0; j < otherPlayers.length; j++) {
                if(info[i].id == otherPlayers[j].id) {
                    otherPlayers[j].update(info[i]);
                    otherPlayers[j].drawNext(board);
                    break;
                }
            }
            var newPlayer = new Player(info[i].x, info[i].y, info[i].id);
            newPlayer.drawNext(board);
            otherPlayers.push(newPlayer);
        }
    };


    this.keyListener = function() {

        var keys = [];
        //document.body.innerHTML = "Keys currently pressed: "
        window.addEventListener("keydown",
            function(e){
                keys[e.keyCode] = e.keyCode;
                keysArray = getNumberArray(keys);
                //document.body.innerHTML = "Keys currently pressed:" + keysArray;
                if(keysArray.toString() == "17,65"){
                    document.body.innerHTML += " Select all!"
                }
            },
            false);

        window.addEventListener('keyup',
            function(e){
                keys[e.keyCode] = false;
                keysArray = getNumberArray(keys);
            },
            false);

        function getNumberArray(arr){
            var newArr = new Array();
            for(var i = 0; i < arr.length; i++){
                if(typeof arr[i] == "number"){
                    newArr[newArr.length] = arr[i];
                }
            }
            return newArr;
        }
    }
}


function Player(x, y, id) {

    var x = x;
    var y = y;
    var id = id;
    var xVel = 0;
    var yVel = 0;
    var xAcc = 0;
    var yAcc = 0;
    var friction = 0.95;

    this.draw = function(board) {
        console.log("X: " + x + " Y: " + y);
        board.fillStyle = "red";
        board.fillRect(x, y, 20, 20);
    };

    this.drawNext = function(board) {
        //board.clearRect(x-15,y-15,50,50);
        calculateVelocity();
        calculateFriction();
        calculatePosition();
        board.fillStyle = "red";
        board.fillRect(x,y,20,20);
        return {
            id: id,
            x : x,
            y : y
        };
    };

    this.update = function(info) {
        x = info.x;
        y = info.y;
    };

    function calculateFriction() {

        xVel = xVel * friction;
        yVel = yVel * friction;

        if(xVel < 0.1 && xVel > -0.1) { xVel = 0;}
        if(yVel < 0.1 && yVel > -0.1) { yVel = 0;}
    }

    function calculatePosition() {
        x += xVel;
        y += yVel;
    }

    function calculateVelocity() {
        xVel += xAcc;
        yVel += yAcc;
    };

    this.accelerate = function(keys) {

        xAcc = 0;
        yAcc = 0;

        if(typeof keys === "undefined") { return; }
        if(keys.includes(37)) {
            xAcc = -1;
        }
        if(keys.includes(38)) {
            yAcc = -1;
        }
        if(keys.includes(39)) {
            xAcc = 1;
        }
        if(keys.includes(40)) {
            yAcc = 1;
        }
    }

}