/*

getRandomLetters(optional usedLetters)

trySubmitWord
https://dictionaryapi.dev/

submitWord

routes
if logged in GET active game

*/


console.log("script ran");
console.log(localStorage.getItem("activeGame"));

//draw letters up to full maybe have a route to create/update
function drawLetters(){
    const activeGame = (localStorage.getItem("activeGame") == null) ? {"letters": [], "score": 0, "activeWord": ""} : JSON.parse(localStorage.getItem("activeGame"));
    
    const remainingLetters = activeGame.letters;
    console.log(remainingLetters);
    
    //else if (remainingLetters < 4){
      const vowels = ["a", "e", "i", "o", "u"];
      const consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
      var numVowles = Math.floor(Math.random() * 3);
      var letterPool = remainingLetters;
  
      for (i = remainingLetters.length; i < 20; i++){
        if (numVowles < 9){
          letterPool.push(vowels[Math.floor(Math.random() * vowels.length)]);
          console.log("Added a vowel to ");
          console.log(letterPool);
          numVowles++;
        }
        else {
          letterPool.push(consonants[Math.floor(Math.random() * consonants.length)]);
          console.log("Added a consonant to ");
          console.log(letterPool);
        }
      }
      //vowles.includes();
      console.log("Returning the following letterPool ");
      console.log(letterPool);
      console.log(typeof letterPool);
      
      localStorage.setItem("activeGame", JSON.stringify({"letters":letterPool, "score":activeGame.score, "activeWord": activeGame.activeWord}));
      return letterPool;
   /* }
    else {
      console.log("ERROR: user attempted to draw new letters while still having " + remainingLetters + " remaining.");
    //  res.status(500).json(err);
    }
    */
}



//ideally a method to make sure the user is unable to put in letters they don't have


const gameTextEntryInput = document.getElementById('gameTextEntry');
const gameActiveWord = document.getElementById('gameValues');
const gameLetterPool = document.getElementById('letterPool');
//temp (maybe) to auto populate
var currentLetters = drawLetters();
var activeGame = JSON.parse(localStorage.getItem("activeGame"))
var activeLetterPool = currentLetters.toString().replace(/,/g, "  ");
var activeWord = "";
gameLetterPool.textContent = activeLetterPool;
//gameTextEntryInput.value = activeWord;
console.log(currentLetters[0]);
console.log(typeof currentLetters);

gameTextEntryInput.addEventListener('input', updateValue);

function updateValue(e) {
    
    currentLetters = activeGame.letters;
    console.log(currentLetters);
    console.log(e.data);
    console.log(e);
    console.log(e.inputType);
    console.log(gameTextEntryInput.value);
    console.log(activeWord);
    

    if (activeLetterPool.includes(e.data)){
        console.log(gameLetterPool.textContent);
        activeWord += e.data;
        gameActiveWord.textContent = activeWord;
        activeLetterPool = activeLetterPool.replace(e.data, "");
        console.log(activeLetterPool);
        gameLetterPool.textContent = activeLetterPool;
        
    }
    else if (e.inputType == "deleteContentBackward"){
        activeLetterPool += "  " + activeWord.substring(activeWord.length -1, activeWord.length);
        console.log(activeLetterPool + "  " + activeWord.substring(activeWord.length -1, activeWord.length));
        activeWord = activeWord.substring(0, activeWord.length -1)
        console.log(activeWord.substring(0, activeWord.length -1));
        
        gameLetterPool.textContent = activeLetterPool;
        gameActiveWord.textContent = activeWord;
        
    }
    else {
        console.log("currentLetters does not contain a ");     
        console.log(e);
    }
    gameTextEntryInput.value = activeWord;
    activeGame.activeWord = activeWord;
    localStorage.setItem("activeGame", JSON.stringify(activeGame));

}

const submitWordButton = document.getElementById('submitWord');
console.log(submitWordButton);
submitWordButton.addEventListener('click', submitWord);
const submittedWord = document.getElementById('submittedWord');
const submittedWordDef = document.getElementById('submittedWordDef');
const gameScore = document.getElementById('gameScore');

function submitWord() {
    console.log(activeWord);
    const dictAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/" + activeWord;
    console.log(dictAPI);

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
                    console.log(currentLetters);
                  }
                  const scoreInt = parseInt(gameScore.textContent.substring(7, gameScore.textContent.length))+ activeWord.length;
                  console.log(gameScore.textContent.substring(0, 7) + scoreInt);
                  gameScore.textContent = gameScore.textContent.substring(0, 7) + scoreInt;
                  activeWord = '';
                  gameLetterPool.textContent = activeLetterPool;
                  gameActiveWord.textContent = activeWord;
                  gameTextEntryInput.value = activeWord;
                  activeGame.letters = currentLetters;
                  activeGame.score = scoreInt;
                  localStorage.setItem("activeGame", JSON.stringify(activeGame));
                })    
          }
          else {
              submittedWordDef.textContent = "Try again... with a real word this time" 
              console.log("Error returned - not a word?");
          }
        })

        
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
      }

}
