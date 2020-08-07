var players = new Array();
var currentPlayer = 0;
var deckId = 0;
var deckLenght = 0;
function createDeck() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        deckId = data.deck_id;
        dealHands();
    });
}
function createPlayers(num) {
    players = new Array();
    for (var i = 1; i <= num; i++) {
        var hand = new Array();
        var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
        players.push(player);
    }
}
function createPlayersUI() {
    document.getElementById('players').innerHTML = '';
    for (var i = 0; i < players.length; i++) {
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_points = document.createElement('div');
        div_points.className = 'points';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i;
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;
        div_playerid.innerHTML = 'Player ' + players[i].ID;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);
    }
}
function startblackjack(playersAmount) {
    document.getElementById('btnStart1').value = 'Restart';
    document.getElementById('btnStart1').onclick = Restart;
    document.getElementById('btnStart2').value = 'Return to main menu';
    document.getElementById('btnStart2').onclick = Return;
    document.getElementById("status").style.display = "none";
    currentPlayer = 0;
    createDeck();
    createPlayers(playersAmount);
    createPlayersUI();
    document.getElementById('player_' + currentPlayer).classList.add('active');
}
function dealHands() {
    for (var i = 0; i < 2; i++) {
        var _loop_1 = function (x) {
            fetch('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=1')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                deckLenght = data.remaining;
                data.cards.map(function (card) {
                    var newCard = getCardData(card);
                    players[x].Hand.push(newCard);
                    renderCard(newCard, x);
                    updatePoints();
                    updateDeck();
                });
            });
        };
        for (var x = 0; x < players.length; x++) {
            _loop_1(x);
        }
    }
}
function getCardData(card) {
    var weight;
    var value = card.value;
    var newValue;
    if (value == "0") {
        weight = 10;
        newValue = "10";
    }
    else if (value == "JACK") {
        weight = 2;
        newValue = "J";
    }
    else if (value == "QUEEN") {
        weight = 3;
        newValue = "Q";
    }
    else if (value == "KING") {
        weight = 4;
        newValue = "K";
    }
    else if (value == "ACE") {
        weight = 11;
        newValue = "A";
    }
    else {
        weight = parseInt(value);
        newValue = value;
    }
    return { Value: newValue, Suit: card.suit, Weight: weight };
}
function renderCard(card, player) {
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
}
function getCardUI(card) {
    var el = document.createElement('div');
    var icon = '';
    if (card.Suit == 'HEARTS')
        icon = '&hearts;';
    else if (card.Suit == 'SPADES')
        icon = '&spades;';
    else if (card.Suit == 'DIAMONDS')
        icon = '&diams;';
    else
        icon = '&clubs;';
    el.className = 'card';
    el.innerHTML = card.Value + '<br/>' + icon;
    return el;
}
function getPoints(player) {
    var points = 0;
    for (var i = 0; i < players[player].Hand.length; i++) {
        points += players[player].Hand[i].Weight;
    }
    players[player].Points = points;
    return points;
}
function updatePoints() {
    for (var i = 0; i < players.length; i++) {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
}
function hitMe() {
    fetch('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=1')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        deckLenght = data.remaining;
        for (var _i = 0, _a = data.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            var newCard = getCardData(card);
            players[currentPlayer].Hand.push(newCard);
            renderCard(newCard, currentPlayer);
            updatePoints();
            updateDeck();
            check();
        }
    });
}
function stay() {
    if (currentPlayer != players.length - 1) {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        currentPlayer += 1;
        document.getElementById('player_' + currentPlayer).classList.add('active');
    }
    else {
        end();
    }
}
function end() {
    var winner = -1;
    var score = 0;
    for (var i = 0; i < players.length; i++) {
        if (players[i].Points > score && players[i].Points < 22) {
            winner = i;
        }
        score = players[i].Points;
    }
    document.getElementById('status').innerHTML = 'Winner: Player ' + players[winner].ID;
    document.getElementById("status").style.display = "inline-block";
}
function check() {
    if (players[currentPlayer].Points > 21) {
        document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
        document.getElementById('status').style.display = "inline-block";
        end();
    }
}
function updateDeck() {
    document.getElementById('deckcount').innerHTML = "" + deckLenght;
}
function Restart() {
    startblackjack(players.length);
}
function Return() {
    document.getElementById('btnStart1').value = 'Start 1 player';
    document.getElementById('btnStart1').onclick = function () { return startblackjack(1); };
    document.getElementById('btnStart2').value = 'Start 2 player';
    document.getElementById('btnStart2').onclick = function () { return startblackjack(2); };
    document.getElementById('players').innerHTML = '';
}
