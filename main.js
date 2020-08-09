var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var players = new Array;
var currentPlayer = 0;
var deckId = 0;
var deckLenght = 0;
var botPlayer = false;
var createDeck = function () {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        deckId = data.deck_id;
        dealHands();
    });
};
var createPlayers = function (botIsPlayer) {
    players = new Array();
    if (!botIsPlayer) {
        for (var i = 1; i <= 2; i++) {
            var hand = new Array();
            var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
            players.push(player);
        }
    }
    else {
        var hand = new Array();
        var player = { Name: 'Player ' + 1, ID: 1, Points: 0, Hand: hand };
        players.push(player);
        var handBot = new Array();
        var bot = { Name: 'Bot', ID: 2, Points: 0, Hand: handBot };
        players.push(bot);
    }
};
var createPlayersUI = function () {
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
};
var startblackjack = function (botIsPlayer) {
    document.getElementById('btnStart1').value = 'Restart';
    document.getElementById('btnStart1').onclick = Restart;
    document.getElementById('btnStart2').value = 'Return to main menu';
    document.getElementById('btnStart2').onclick = Return;
    document.getElementById("status").style.display = "none";
    currentPlayer = 0;
    botPlayer = botIsPlayer;
    createDeck();
    createPlayers(botIsPlayer);
    createPlayersUI();
    document.getElementById('player_' + currentPlayer).classList.add('active');
};
var dealHands = function () {
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
                    updateDeckLenght();
                    checkAce(players[x]);
                });
            });
        };
        for (var x = 0; x < players.length; x++) {
            _loop_1(x);
        }
    }
};
var checkAce = function (player) {
    var aceCount = player.Hand.filter(function (x) { return x.Value == "A"; }).length;
    if (aceCount == 2) {
        document.getElementById('status').innerHTML = 'Winner: Player ' + player.ID;
        document.getElementById("status").style.display = "inline-block";
    }
};
var getCardData = function (card) {
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
};
var renderCard = function (card, player) {
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
};
var getCardUI = function (card) {
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
};
var getPoints = function (player) {
    var points = 0;
    for (var i = 0; i < players[player].Hand.length; i++) {
        points += players[player].Hand[i].Weight;
    }
    players[player].Points = points;
    return points;
};
var updatePoints = function () {
    for (var i = 0; i < players.length; i++) {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
};
var hitMe = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, data, _i, _a, card, newCard;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetch('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=1')];
            case 1:
                response = _b.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _b.sent();
                deckLenght = data.remaining;
                for (_i = 0, _a = data.cards; _i < _a.length; _i++) {
                    card = _a[_i];
                    newCard = getCardData(card);
                    players[currentPlayer].Hand.push(newCard);
                    renderCard(newCard, currentPlayer);
                    updatePoints();
                    updateDeckLenght();
                    check();
                }
                return [2 /*return*/];
        }
    });
}); };
var stay = function () {
    if (currentPlayer != players.length - 1) {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        currentPlayer += 1;
        document.getElementById('player_' + currentPlayer).classList.add('active');
        if (players[currentPlayer].Name == "Bot") {
            botTurn(players[currentPlayer]);
        }
    }
    else {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        end();
    }
};
var botTurn = function (bot) { return __awaiter(_this, void 0, void 0, function () {
    var random;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(bot.Points < 21)) return [3 /*break*/, 6];
                if (!(bot.Points < 15)) return [3 /*break*/, 2];
                return [4 /*yield*/, hitMe()];
            case 1:
                _a.sent();
                return [3 /*break*/, 5];
            case 2:
                random = Math.random();
                if (!(random < 0.5)) return [3 /*break*/, 4];
                return [4 /*yield*/, hitMe()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4: return [3 /*break*/, 6];
            case 5: return [3 /*break*/, 0];
            case 6:
                stay();
                return [2 /*return*/];
        }
    });
}); };
var end = function () {
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
};
var check = function () {
    if (players[currentPlayer].Points > 21) {
        document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
        document.getElementById('status').style.display = "inline-block";
        end();
    }
};
var updateDeckLenght = function () {
    document.getElementById('deckcount').innerHTML = "" + deckLenght;
};
var Restart = function () {
    startblackjack(botPlayer);
};
var Return = function () {
    document.getElementById('btnStart1').value = 'Start 1 player game';
    document.getElementById('btnStart1').onclick = function () { return startblackjack(false); };
    document.getElementById('btnStart2').value = 'Start 2 player game';
    document.getElementById('btnStart2').onclick = function () { return startblackjack(true); };
    document.getElementById("status").style.display = "none";
    document.getElementById('deckcount').innerHTML = "" + 52;
    document.getElementById('players').innerHTML = '';
};
