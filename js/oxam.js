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
}

function runOfGames(nGames, nCards)
{
    var wins = 0;
    for ( var i = 0; i < nGames; i++ )
    {
        var thisGameStatus = playGame(nCards);
        if ( thisGameStatus == 'win' )
        {
            wins = wins + 1;
        }
    }
    return wins;
}



function runGraphicalGame(nCards)
{
    var svg = d3.select(document.getElementById("SVG01"));
    svg.selectAll("*").remove();
    var height = svg.attr("height");
    var width = svg.attr("width");

    var cards = getCards(nCards);
    cards = shuffle(cards);

    var margin = {};
    margin.left = width/30;
    margin.right = width/30;
    margin.top = height/20;
    margin.bottom = height/5;

    var xScale = d3.scale.ordinal().domain(d3.range(nCards)).rangeRoundBands([margin.left, width-margin.right], .2);
    var yScale = d3.scale.linear().domain([0, nCards+1]).range([height-margin.bottom, margin.top]);
    var hScale = d3.scale.linear().domain([0, nCards+1]).range([0, height-margin.top-margin.bottom]);

    var expCard = d3.sum(cards)/cards.length;
    
    var lastCardIndex = -1;
    svg.style("background-color", "whiteSmoke");
    svg.selectAll('rect')
    .data(cards)
    .enter()
    .append('rect')
    .attr('x', function(d,i) { return xScale(i); } )
    .attr('y', function(d,i) { return yScale(expCard); } )
    .attr('height', function(d,i){ return hScale(expCard);} )
    .attr('width', function(d,i){ return xScale.rangeBand();})
    .attr('fill', 'blue')
    .on("click", cardClick);

    function cardClick(d,i)
    {
       if ( i == lastCardIndex + 1 )
       {
           lastCardIndex = lastCardIndex + 1;
           var bar = d3.select(this);
           bar.transition(2000)
           .attr("width", 0)
           .transition(2000)
           .attr("width", xScale.rangeBand())
           .style("fill", "red")
           .transition(2000)
           .attr("y", yScale(d))
           .attr("height", hScale(d));

           if ( i <= cards.length - 2 )
           {
               var p = probOfNextCardHigher(cards, i);
               var message = "";
               if ( p >= .5 )
               {
                   message = "Please click the next card, which is higher with probability: " + p;
               }
               else
               {
                   message = "Please click the next card, which is lower with probability: " + (1-p);
               }
               d3.select("#messagePara")
               .text(message)
               .style("font-weight", "bold");
           }

           if ( i == cards.length - 1 )
           {
               d3.select("#messagePara")
               .text("This run is finished! press the restart button to play again.")
               .style("font-weight", "bold");
           }

           

           svgText.attr("y", function(d, j)
           {
               if ( j <= i )
               {
                  return yScale(d)-5;
               }
               else
               {
                  return yScale(.3);
               }
           });
       }

    }


    var svgText = svg.selectAll("text")
    .data(cards)
    .enter()
    .append("text")
    .attr("x", function(d,i) { return xScale(i) + xScale.rangeBand()/2; } )
    .attr("y", function(d,i) { return yScale(.3); } )
    .text(function(d) { return d; } )
    .attr("text-anchor", "middle")
    .attr("fill", "blue");
}

function reset()
{
    var nCards = 13;
    runGraphicalGame(nCards);
}

function simulate()
{
    reset()
    var nGames = document.getElementById("nGamesField").value;
    if ( nGames > 100000 )
    {
        nGames = 100000;
    }
    if ( nGames <= 0 )
    {
        nGames = 1;
    }
    document.getElementById("nGamesField").value = nGames;

    var nCards = 13;
    var wins = runOfGames(nGames, nCards);
    var p = (wins*100.0/nGames);
    d3.select(document.getElementById("probPara"))
    .text(wins + " out of " + nGames + " games won. Porbability of win = " + p + "%." )
    .style("font-weight", "bold");
}
