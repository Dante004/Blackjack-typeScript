
        let players = new Array();
        let currentPlayer = 0;
        let deckId = 0;
        let deckLenght = 0;

        function createDeck()
        {
            fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => {
                deckId = data.deck_id;
                dealHands();
            });

        }

        function createPlayers(num)
        {
            players = new Array();
            for(let i = 1; i <= num; i++)
            {
                let hand = new Array();
                let player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
                players.push(player);
            }
        }

        function createPlayersUI()
        {
            document.getElementById('players').innerHTML = '';
            for(let i = 0; i < players.length; i++)
            {
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
        }

        function startblackjack(playersAmount)
        {
            document.getElementById('btnStart1').nodeValue = 'Restart';
            document.getElementById('btnStart1').onclick = Restart;
            document.getElementById('btnStart2').nodeValue = 'Return to main menu';
            document.getElementById('btnStart2').onclick = Return;
            document.getElementById("status").style.display="none";
            currentPlayer = 0;
            createDeck();
            createPlayers(playersAmount);
            createPlayersUI();
            document.getElementById('player_' + currentPlayer).classList.add('active');
        }
        

        function dealHands()
        {
           for(let i = 0; i < 2; i++)
           {
               for (let x = 0; x < players.length; x++)
                {
                    fetch('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=1')
                    .then(response => response.json())
                    .then(data => {
                        deckLenght = data.remaining;
                        data.cards.map((card)=>
                        {
                            var newCard = getCardData(card);
                            players[x].Hand.push(newCard);
                            renderCard(newCard, x);
                            updatePoints();
                            updateDeck();
                        });
                    });
                }
            }
        }

        function getCardData(card)
        {
            let weight;
            let value = card.value;
            let newValue;

            if(value == "0")
            {
                weight = 10;
                newValue = "10";
            }
            else if(value == "JACK")
            {
                weight = 2;
                newValue = "J";
            }
            else if(value == "QUEEN")
            {
                weight = 3;
                newValue = "Q";
            }
            else if(value == "KING")
            {
                weight = 4;
                newValue = "K";
            }
            else if(value == "ACE")
            {
                weight = 11;
                newValue = "A";
            }
            else
            {
                weight = parseInt(value);
                newValue = value;
            }

            return { Value: newValue, Suit: card.suit, Weight: weight };
        }

        function renderCard(card, player)
        {
            let hand = document.getElementById('hand_' + player);
            hand.appendChild(getCardUI(card));
        }

        function getCardUI(card)
        {
            let el = document.createElement('div');
            let icon = '';
            if (card.Suit == 'HEARTS')
            icon='&hearts;';
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

        function getPoints(player)
        {
            let points = 0;
            for(let i = 0; i < players[player].Hand.length; i++)
            {
                points += players[player].Hand[i].Weight;
            }
            players[player].Points = points;
            return points;
        }

        function updatePoints()
        {
            for (let i = 0 ; i < players.length; i++)
            {
                getPoints(i);
                document.getElementById('points_' + i).innerHTML = players[i].Points;
            }
        }

        function hitMe()
        {
            fetch('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=1')
            .then(response => response.json())
            .then(data => {
                deckLenght = data.remaining;
                for(let card of data.cards)
                {
                    var newCard = getCardData(card);
                    players[currentPlayer].Hand.push(newCard);
                    renderCard(newCard, currentPlayer);
                    updatePoints();
                    updateDeck();
                    check();
                }
            });
        }

        function stay()
        {
            if (currentPlayer != players.length-1) {
                document.getElementById('player_' + currentPlayer).classList.remove('active');
                currentPlayer += 1;
                document.getElementById('player_' + currentPlayer).classList.add('active');
            }

            else {
                end();
            }
        }

        function end()
        {
            let winner = -1;
            let score = 0;

            for(let i = 0; i < players.length; i++)
            {
                if (players[i].Points > score && players[i].Points < 22)
                {
                    winner = i;
                }

                score = players[i].Points;
            }

            document.getElementById('status').innerHTML = 'Winner: Player ' + players[winner].ID;
            document.getElementById("status").style.display = "inline-block";
        }

        function check()
        {
            if (players[currentPlayer].Points > 21)
            {
                document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
                document.getElementById('status').style.display = "inline-block";
                end();
            }
        }

        function updateDeck()
        {
            document.getElementById('deckcount').innerHTML = "" + deckLenght;
        }

        function Restart()
        {
            startblackjack(players.length);
        }

        function Return()
        {
            document.getElementById('btnStart1').nodeValue = 'Start 1 player';
            document.getElementById('btnStart1').onclick = () => startblackjack(1);
            document.getElementById('btnStart2').nodeValue = 'Start 2 player';
            document.getElementById('btnStart2').onclick = () => startblackjack(2);

            document.getElementById('players').innerHTML = '';
        }