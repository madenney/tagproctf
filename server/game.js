


exports.Game = function() {

    console.log("Starting Game");
    var players = [];

    this.start = function() {
        console.log("Starting Game");
    }

    this.addPlayer = function() {
        console.log("Adding Player");
        var newPlayer = new Player(players.length);
        players.push(newPlayer);
        return newPlayer.getId();
    }

    this.update = function(info) {
        players[info.id].update(info);
    }

    this.getInfo = function(skipId) {
        var info = [];
        for(var i = 0; i < players.length; i++) {
            if(i == skipId) { continue;}
            info.push(players[i].getInfo());
        }
        return info;
    }
};



function Player(id) {

    var id = id;
    var x;
    var y;

    console.log("Creating New Player: ID: " + id);

    this.update = function(info) {
        x = info.x;
        y = info.y;
    }

    this.getId = function(){
        return id;
    }

    this.getInfo = function() {
        return {
            x : x,
            y : y,
            id : id
        }
    }
}