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
    const activeGame = (localStorage.getItem("activeGame") == null) ? {"letters": ["a"], "score": 0} : localStorage.getItem("activeGame");
    const remainingLetters = activeGame.letters;
    console.log(remainingLetters);
    
    //else if (remainingLetters < 4){
      const vowels = ["a", "e", "i", "o", "u"];
      const consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
      const numVowles = Math.floor(Math.random() * 6);
      const letterPool = remainingLetters;
  
      for (i = remainingLetters.length; i < 20; i++){
        if (numVowles < 12){
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
      
      localStorage.setItem("activeGame", JSON.stringify({"letters":letterPool.join(), "score":activeGame.score}));
      return letterPool;
   /* }
    else {
      console.log("ERROR: user attempted to draw new letters while still having " + remainingLetters + " remaining.");
    //  res.status(500).json(err);
    }
    */
}



//ideally a method to make sure the user is unable to put in letters they don't have
const currentLetters = drawLetters();

const input = document.querySelector('gameTextEntry');
const log = document.getElementById('gameValues');

input.addEventListener('input', updateValue);

function updateValue(e) {
    console.log(currentLetters);
    if (currentLetters.includes(e)){
        log.textContent = e.target.value;
    }
    else {
        console.log("currentLetters does not contain a ");
        console.log(e);
    }
    
}



const submitWord = (potentialWord) => {
    const dictAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/" + potentialWord.join();
    console.log(dictAPI);
    try {
        fetch(dictAPI)
        .then(response => response.json())
        .then(responseJSON => {
            console.log(responseJSON);
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
      }

}
