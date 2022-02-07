
var activeGame;

//draw letters up to full in case of a new game or new round
function drawLetters(){
    //if there is an active game in memory get it, if not create one from scratch
    activeGame = (localStorage.getItem("activeGame") == null) ? {"letters": [], "score": 0, "activeWord": ""} : JSON.parse(localStorage.getItem("activeGame"));
    
    const remainingLetters = activeGame.letters;
    const vowels = ["a", "e", "i", "o", "u"];
    //non j, x, q, z letters are present twice to make those harder to use letters rarer
    const consonants = ["b", "c", "d", "f", "g", "h", "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w",
       "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "x", "y", "y", "z"];
    var numVowles = Math.floor(Math.random() * 2);
    var letterPool = remainingLetters;
  
    //semi randomly populate the letters the player has to use - making sure they don't end up blocked due too many or too few vowels
    for (i = remainingLetters.length; i < 12; i++){
        if (numVowles < 5){
            letterPool.push(vowels[Math.floor(Math.random() * vowels.length)]);
            numVowles++;
        }
        else {
          letterPool.push(consonants[Math.floor(Math.random() * consonants.length)]);

        }
    }

    //shuffle the array so the vowels are mixed within the consonants for easier readability
    function shuffleArray(arr) {
      arr.sort(() => Math.random() - 0.5);
    }
    shuffleArray(letterPool);
    
    //save the letters to the active game in memory/creating a new activeGame with drawn letters
    localStorage.setItem("activeGame", JSON.stringify({"letters":letterPool, "score":activeGame.score, "activeWord": activeGame.activeWord}));
    return letterPool;

}

//initilize docs for later use
const gameTextEntryInput = document.getElementById('gameTextEntry');
const gameActiveWord = document.getElementById('gameValues');
const gameLetterPool = document.getElementById('letterPool');
const submitWordButton = document.getElementById('submitWord');
const submittedWord = document.getElementById('submittedWord');
const submittedWordDef = document.getElementById('submittedWordDef');
const gameStatus = document.getElementById('gameStatus');
const gameScore = document.getElementById('gameScore');
const newGameButton = document.getElementById('newGame');
const submitScoreButton = document.getElementById('submitScore');


//auto start/resume game on page load
var currentLetters;
if (localStorage.getItem("activeGame") == null){
    currentLetters = drawLetters();
}
else {
    activeGame = JSON.parse(localStorage.getItem("activeGame"));
    currentLetters = activeGame.letters;
    gameScore.textContent = gameScore.textContent.substring(0, 7) + activeGame.score;
}

var activeLetterPool = currentLetters.toString().replace(/,/g, "  ");
var activeWord = "";
gameLetterPool.textContent = activeLetterPool;



gameTextEntryInput.addEventListener('input', updateValue);
//function to control how the text entry field works
function updateValue(e) {
    console.log(e.data);
    const enteredChar = (e.data == null) ? (e.data) : (e.data).toLowerCase();
    currentLetters = activeGame.letters;
    //if the letter typed is avalable to use it adds it to the end of the active word and removes it from the pool of available letters
    if (activeLetterPool.includes(enteredChar)){
        
        activeWord += enteredChar;
        gameActiveWord.textContent = activeWord;
        activeLetterPool = activeLetterPool.replace(enteredChar, "");
        gameLetterPool.textContent = activeLetterPool;
        gameStatus.textContent = "";
        
    }
    //if backspace is used it deletes the last letter of the active word and re-adds the letter to the pool of available letters
    else if (e.inputType == "deleteContentBackward"){
        activeLetterPool += "  " + activeWord.substring(activeWord.length -1, activeWord.length);
        activeWord = activeWord.substring(0, activeWord.length -1)
        gameLetterPool.textContent = activeLetterPool;
        gameActiveWord.textContent = activeWord;
        
    }
    else {
        console.log("currentLetters does not contain a: " + e.data);     
    }
    gameTextEntryInput.value = activeWord;
    activeGame.activeWord = activeWord;
    localStorage.setItem("activeGame", JSON.stringify(activeGame));

}



submitWordButton.addEventListener('click', submitWord);
//function to submit type word - aka check against 3rd party api to see if it is a woord, then permanantly remove the letters from activeGame and award the player with coorisponding points
function submitWord() {

    if (activeWord.length >= 2){
        const dictAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/" + activeWord;
        console.log(dictAPI);
        gameStatus.textContent = "Looking up " + activeWord + "...";

        try {
            fetch(dictAPI)
            .then(response => {
              if(response.status == 200){
                  response.json()
                  .then(responseJSON => {
                    
                      
                      submittedWord.textContent += "\n" + activeWord;
                      submittedWordDef.textContent = responseJSON[0].meanings[0].definitions[0].definition;
        
                      const activeWordSplit = activeWord.split('');
                      for (i = 0; i < activeWordSplit.length; i++){
                        const indexToRemove = currentLetters.findIndex(req => {
                          return req == activeWord.split('')[i];
                        })
                        
                        currentLetters.splice(indexToRemove, 1);

                      }
                      const scoreInt = parseInt(gameScore.textContent.substring(7, gameScore.textContent.length))+ activeWord.length;
                      gameScore.textContent = gameScore.textContent.substring(0, 7) + scoreInt;
                      activeWord = '';
                      gameLetterPool.textContent = activeLetterPool;
                      gameActiveWord.textContent = activeWord;
                      gameTextEntryInput.value = activeWord;
                      gameStatus.textContent = "";
                      activeGame.letters = currentLetters;
                      activeGame.score = scoreInt;
                      localStorage.setItem("activeGame", JSON.stringify(activeGame));
                      //if the player only has 1 or less letters it starts a new round
                      if(currentLetters.length <= 3){
                        //the player uses up all their letter they get a bonus
                        if (currentLetters.length == 0){
                          activeGame.score += 5;
                          gameScore.textContent = gameScore.textContent.substring(0, 7) + activeGame.score;
                        }
                        submittedWord.textContent = "";
                        gameStatus.textContent = "Congrats!! Now on to the next round!"
                        console.log("Letters used up - moving on to the next round");
                        currentLetters = drawLetters();
                        activeLetterPool = currentLetters.toString().replace(/,/g, "  ");
                        gameLetterPool.textContent = activeLetterPool;
                      }
                    })    
              }
              else {
                  gameStatus.textContent = "Try again... with a real word this time" ;
                  console.log("Error returned - not a word?");
              }
            })

            
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            gameStatus.textContent = "Looks like there was an error with the dictionary. Try again."
        }
    }
}


newGameButton.addEventListener('click', newGame);
//the player uses the new game button to discard thier current progress and start a new game
function newGame(){
    activeGame = {"letters": [], "score": 0, "activeWord": ""};
    localStorage.setItem("activeGame", JSON.stringify(activeGame));    
    currentLetters = drawLetters();
    gameScore.textContent = gameScore.textContent.substring(0, 7) + activeGame.score;
    activeLetterPool = currentLetters.toString().replace(/,/g, "  ");
    activeWord = "";
    gameLetterPool.textContent = activeLetterPool;
    gameActiveWord.textContent = "";
    gameTextEntryInput.value = "";
    submittedWord.textContent = "";
    submittedWordDef.textContent = "";
    gameStatus.textContent = "Round 1 - Start!";
}

const submitScore = async (event) => {
    event.preventDefault();
    if (localStorage.getItem("userid") != null){

        
        const userid = localStorage.getItem("userid");
        const scores = parseInt(activeGame.score);
        const response = await fetch('/score', {
                method: 'POST',
                body: JSON.stringify({ userid, scores }),
                headers: { 'Content-Type': 'application/json' },
                });
                if (response.ok) {
                    newGame();
                    alert("Saved score");
                }   
                else {
                    alert("Failed to submit score");
                }

    }
    else {
        gameStatus.textContent = "The user needs to be logged in to save their score to the high score... so login, refresh and SUBMIT!! FOR GLORY!!";
    }

}

submitScoreButton.addEventListener('click', submitScore);