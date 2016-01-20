// Shuffles integers in cards
// in linear time
function shuffle(cards) 
{
     var n = cards.length;
     var temp;
     var i;

     while ( n > 0 )
     {
         // Pick a card
         i = Math.floor(Math.random() * n);
         n = n - 1;

         // Swap it with the current card:
         temp = cards[n];
         cards[n] = cards[i];
         cards[i] = temp;
     }
     return cards;
}

// Returns an array of integers
// from 1 to nCards
function getCards(nCards)
{
    var cards = [];
    for ( var i = 0; i < nCards; i++ )
    {
        cards[i] = i + 1;
    }
    return cards;
}

function probOfNextCardHigher(cards, index)
{
    var currentCard = cards[index];
    var numOfHiddenCards = cards.length - (index + 1);
    var numOfHigherCards = cards.filter( function(d, i) 
            { 
                return (i > index && d > cards[index]); 
            }).length;

    // Compute the probability:
    var p = numOfHigherCards/numOfHiddenCards;
    return p;
}
// Returns 1 if the probability of next card 
// being higher than the current card is >= .5
// and returns 0 otherwise
function guessNextCard(cards, index)
{
    var p = probOfNextCardHigher(cards, index);

    if ( p >= .5 )
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

// Simulates a single game and 
// returns the status of the game
function playGame(nCards)
{
    var cards = getCards(nCards);
    cards = shuffle(cards);

    var cardIndex = 0;
    var gameStaus = 'inPlay';

    while ( gameStaus == 'inPlay')
    {
        if ( cardIndex == cards.length - 2 )
        {
            // You have reached the second last card!
            gameStatus = 'win';
            return gameStatus;
        }

        var highGuess = guessNextCard(cards, cardIndex);

        if ( highGuess == 1 )
        {
            if ( cards[cardIndex+1] > cards[cardIndex] )
            {
                gameStatus = 'inPlay';
            }
            else
            {
                gameStatus = 'loss';
                return gameStatus;
            }
        }
        else
        {
            if ( cards[cardIndex+1] < cards[cardIndex] )
            {
                gameStatus = 'inPlay';
            }
            else
            {
                gameStatus = 'loss';
                return gameStatus;
            }
        }

        cardIndex = cardIndex + 1;
    }
    console.log('how did this happen');
}

function runOfGames(nGames, nCards)
{
    var wins = 0;
    for ( var i = 0; i < nGames; i++ )
    {
        var thisGameStatus = playGame(nCards);
        console.log(thisGameStatus);
        if ( thisGameStatus == 'win' )
        {
            wins = wins + 1;
        }
    }
    var p = (100.0*wins)/nGames;
    console.log('Probability of win: ' + p + ' %');
    return wins;
}
