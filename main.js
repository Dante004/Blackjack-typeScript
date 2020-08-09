let players = new Array;
let currentPlayer = 0;
let deckId = 0;
let deckLenght = 0;
let botPlayer = false;
let gameIsActive = false;
const createDeck = () => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(response => response.json())
        .then(data => {
        deckId = data.deck_id;
        dealHands();
    });
};
const createPlayers = (botIsPlayer) => {
    players = new Array();
    if (botIsPlayer == false) {
        for (let i = 1; i <= 2; i++) {
            let hand = new Array();
            let player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
            players.push(player);
        }
    }
    else {
        let hand = new Array();
        let player = { Name: 'Player ' + 1, ID: 1, Points: 0, Hand: hand };
        players.push(player);
        let handBot = new Array();
        let bot = { Name: 'Bot', ID: 2, Points: 0, Hand: handBot };
        players.push(bot);
    }
};
const createPlayersUI = () => {
    document.getElementById('players').innerHTML = '';
    for (let i = 0; i < players.length; i++) {
        let div_player = document.createElement('div');
        let div_playerid = document.createElement('div');
        let div_hand = document.createElement('div');
        let div_points = document.createElement('div');
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
const startblackjack = (botIsPlayer) => {
    document.getElementById('btnStart1').value = 'Restart';
    document.getElementById('btnStart1').onclick = Restart;
    document.getElementById('btnStart2').value = 'Return to main menu';
    document.getElementById('btnStart2').onclick = Return;
    document.getElementById("status").style.display = "none";
    gameIsActive = true;
    currentPlayer = 0;
    botPlayer = botIsPlayer;
    createDeck();
    createPlayers(botIsPlayer);
    createPlayersUI();
    document.getElementById('player_' + currentPlayer).classList.add('active');
};
const dealHands = () => {
    for (let i = 0; i < 2; i++) {
        for (let x = 0; x < players.length; x++) {
            fetch('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=1')
                .then(response => response.json())
                .then(data => {
                deckLenght = data.remaining;
                data.cards.map((card) => {
                    var newCard = getCardData(card);
                    players[x].Hand.push(newCard);
                    renderCard(newCard, x);
                    updatePoints();
                    updateDeckLenght();
                    checkAce(players[x]);
                });
            });
        }
    }
};
const checkAce = (player) => {
    let aceCount = player.Hand.filter(x => x.Value == "A").length;
    if (aceCount == 2) {
        document.getElementById('status').innerHTML = 'Winner: Player ' + player.ID;
        document.getElementById("status").style.display = "inline-block";
        gameIsActive = false;
    }
};
const getCardData = (card) => {
    let weight;
    let value = card.value;
    let newValue;
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
const renderCard = (card, player) => {
    let hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
};
const getCardUI = (card) => {
    let element = document.createElement('div');
    let icon = '';
    if (card.Suit == 'HEARTS')
        icon = '&hearts;';
    else if (card.Suit == 'SPADES')
        icon = '&spades;';
    else if (card.Suit == 'DIAMONDS')
        icon = '&diams;';
    else
        icon = '&clubs;';
    element.className = 'card';
    element.innerHTML = card.Value + '<br/>' + icon;
    return element;
};
const getPoints = (player) => {
    let points = 0;
    for (let i = 0; i < players[player].Hand.length; i++) {
        points += players[player].Hand[i].Weight;
    }
    players[player].Points = points;
};
const updatePoints = () => {
    for (let i = 0; i < players.length; i++) {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
};
const hitMe = async () => {
    if (gameIsActive == true) {
        const response = await fetch('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=1');
        const data = await response.json();
        deckLenght = data.remaining;
        for (let card of data.cards) {
            var newCard = getCardData(card);
            players[currentPlayer].Hand.push(newCard);
            renderCard(newCard, currentPlayer);
            updatePoints();
            updateDeckLenght();
            check();
        }
    }
};
const stay = () => {
    if (gameIsActive == true) {
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
    }
};
const botTurn = async (bot) => {
    while (bot.Points < 21) {
        if (bot.Points < 18) {
            await hitMe();
        }
        else {
            var random = Math.random();
            if (random < 0.5) {
                await hitMe();
            }
            else {
                break;
            }
        }
    }
    stay();
};
const end = () => {
    let winner = -1;
    let score = 0;
    for (let i = 0; i < players.length; i++) {
        if (players[i].Points > score && players[i].Points < 22) {
            winner = i;
        }
        score = players[i].Points;
    }
    document.getElementById('status').innerHTML = 'Winner: Player ' + players[winner].ID;
    document.getElementById("status").style.display = "inline-block";
    gameIsActive = false;
};
const check = () => {
    if (players[currentPlayer].Points > 21) {
        document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
        document.getElementById('status').style.display = "inline-block";
        gameIsActive = false;
    }
};
const updateDeckLenght = () => {
    document.getElementById('deckcount').innerHTML = "" + deckLenght;
};
const Restart = () => {
    startblackjack(botPlayer);
};
const Return = () => {
    document.getElementById('btnStart1').value = 'Start 1 player game';
    document.getElementById('btnStart1').onclick = () => startblackjack(false);
    document.getElementById('btnStart2').value = 'Start 2 player game';
    document.getElementById('btnStart2').onclick = () => startblackjack(true);
    document.getElementById("status").style.display = "none";
    document.getElementById('deckcount').innerHTML = "" + 52;
    document.getElementById('players').innerHTML = '';
};
