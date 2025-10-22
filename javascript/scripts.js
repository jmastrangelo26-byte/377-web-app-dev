function Card(suit, rank, value){
    this.suit = suit;
    this.rank = rank; 
    this.value = value; 
}

let deck = [];

function shuffleDeck(){
    let suits = ["hearts", "Diamonds", "Clubs", "Spades"]; 

    for (let i = 0; i < 4; i++){
        for(let rank = 1; rank < 14; rank++){

            // The second parameter should translate 1, 11, 12, 13 to A, J, Q, K, respectively 
            let card = new Card(suits[i], rank, rank);
            deck.push(card);
        }

        // use a readily available shuffle algorithm to shuffle the deck, give credit to the author
        deck.sort(() => Math.random() - 0.5)
    }
}

function dealCard(){
    let nextCard = deck.pop();
    $("#card").html(nextCard.rank + " of " + nextCard.suit);
}
