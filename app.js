$('#btnGet').on('click', function(){
  $.fancybox({
    maxWidth	: 800,
    maxHeight	: 600,
    fitToView	: false,
    width		: '70%',
    height		: '70%',
    autoSize	: false,
    closeClick	: false,
    openEffect	: 'none',
    closeEffect	: 'none',
    href: '#inline'
  });
})



var RosterController = function (playerFactory) {
  var _this = this;
  this.roster = {};

  this.addPlayer = function (name, position, number) {
    if (!name || !position || !number || isNaN(number)) {
      alert("Invalid Player Data");
      return;
    }
    var player = playerFactory.createPlayer(name, position, number);
    _this.roster[player.id] = player;
    _this.updateRoster();
  }

  this.deletePlayer = function (id) {
    delete _this.roster[id];
    _this.updateRoster();
  }

  this.updateRoster = function () {
    saveData();
    var rosterDiv = $(".player-roster");
    rosterDiv.html('');
    for (var id in _this.roster) {
      var player = _this.roster[id];
      var html = '<div class="player-card">' + '<button class="btn btn-xs btn-danger remove" player-id="' + player.id + '">Remove</button>' +'<div>' +'<img src="http://s.nflcdn.com/static/content/public/image/fantasy/transparent/200x200/" />' +'</div>' +'<div>' +
        '<span>' + player.name + '</span>' +'</div>' +'<div>' + '<span>' + player.position + '</span>' +'</div>' +'<div>' +
        '<span>' + player.number + '</span>' + '</div>' +'</div>';
      rosterDiv.append(html);
    }
  }

  function saveData() {
    localStorage.setItem("roster", JSON.stringify(_this.roster))
  }

  function loadData() {
    _this.roster = JSON.parse(localStorage.getItem("roster")) || {};
  }

  $("#add-player-form").on('submit', function () {
    event.preventDefault();
    var name = $('#name').val();
    var position = $('#pos').val();
    var number = $('#num').val();
    _this.addPlayer(name, position, number);
  });

  $(".expand-player-panel").on('click', function () {
    $(".panel-add-player .panel-body").toggle(200)
  });

  $(".player-roster").on('click', '.remove', function (event) {
    _this.deletePlayer($(this).attr('player-id'));
  })

  loadData();
  this.updateRoster();
}

var Player = function (name, position, number, id) {
  this.name = name;
  this.position = position;
  this.number = number;
  this.id = id;
}

$(function () {
  var playerFactory = {
    _uniqueId: 0,
    createPlayer: function (name, position, number) {
      this._uniqueId++;
      return new Player(name, position, number, this._uniqueId);
    }
  }

 RosterController = new RosterController(playerFactory);
});
var playerService = function () {

  var _players = [];

  return {
    loadPlayers: function (cb) {
      var url = "http://bcw-getter.herokuapp.com/?url=";
      var url2 = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";
      var apiUrl = url + encodeURIComponent(url2);

      $.getJSON(apiUrl, function (response) {
        _players = response.body.players;
        cb();

      })
    },
    getPlayers: function () {
      return _players;
    },
    getPlayersByTeam: function (team) {
      var requestedTeam = _players.filter(function (player) {
        if (player.pro_team === team) {
          return true;
        }
      })
      return requestedTeam;
    }
	}
}

	var ps = new playerService();
  $('#btnSearch').on('click', function(){
    ps.loadPlayers();
  })
