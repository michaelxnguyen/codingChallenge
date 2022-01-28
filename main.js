// Create a game to unscramble letters (anagrams)
// STARTED AT 5:10, FINISH BY 10
// if theres extra time, add hints, check against a dictionary api

import inquirer from "inquirer"
import fetch from "node-fetch"

async function askForPlayerResponse(promptWord, guessList) {
    let guessesString = ``
    for (x in guessList) {
        guessesString += `
        ` + x
    }
    inquirer
        .prompt([
            {
            name: 'wordResponse',
            message: `previous guesses: ` + guessList + `
            
            Guess the word: ` + promptWord,
            },
        ])
        .then(answers => {
            return answers.wordResponse
        });
}

// checking through a dictionary api if something is a word
// below is the response if no word is found
// {
//     "title": "No Definitions Found",
//     "message": "Sorry pal, we couldn't find definitions for the word you were looking for.",
//     "resolution": "You can try the search again at later time or head to the web instead."
// }
async function checkIfWord(word) {
    let response = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
    if (response.title == "No Definitions Found") {
        return false
    } else true
}

/// separate async function for getting a random word
async function getRandomWord() {
    // the swear tag prevents removes swear words from the pool
    let randomWord
    try {
        let response = await fetch("https://random-word-api.herokuapp.com/word?number=1&swear=0")
        let json = await response.json()
        randomWord = json.pop()
    } catch {
        console.log("Something went wrong when retrieving your word from the api, please run the file again. if the  problem persists, check the status of the api at https://random-word-api.herokuapp.com/home")
    }
}

function shuffleLetters(lettersArray) {
    for (i = lettersArray.length() -1; i >0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            /// below we shuffle around the array object posistions using the random letters
            const temp = lettersArray[i]
            lettersArray[i] = lettersArray[j]
            lettersArray[j] = temp 
        }
}

async function anagramsGame() {
    let correctAnswer = false
    let guessedWords = []
    
    // Greet the user
    console.log("Welcome to anagrams")
    console.log(`The letters of a random word are displayed. 
Type in your guess for the word and hit ENTER. 
If your guess is correct, you win. 
If your guess is incorrect, it will be added to the list and you will be prompted to guess again.`)
    
    // async here fails, I cannot get it to work.
    let randomWord = await getRandomWord()
    
    // Scramble the word
    // old shuffle code
    // let wordLetters = randomWord.split("")
    // let shuffledArray = wordLetters.sort((a, b) => 0.5 - Math.random())
    // let shuffledWord = shuffledArray.join("")

    let wordLetters = randomWord.split("")
    shuffleLetters(wordLetters)
    let shuffledWord = wordLetters.join("")

    // Allow for player word entry
    let playerResponse
    // This will loop until word is found and we change to true
    while (correctAnswer == false) {
        playerResponse = await askForPlayerResponse(shuffledWord, guessedWords)
        // Validate that the word is not a duplicate
        if (guessedWords.includes(playerResponse)) {
            console.log("You have already guessed " + playerResponse)
            continue
        } else {
            // Validate that it only uses the letters allowed (use lower case to avoid casing issues)
            let tempLettersArray = shuffledWord.toLowerCase().split("")
            let splitPlayerResponse  = playerResponse.toLowerCase().split("")
            let usesValidLetters = true
            for (x in splitPlayerResponse) {
                let index = tempLettersArray.indexOf(x)
                if (index !== -1) {
                    tempLettersArray.splice(index, 1)
                } else {
                    usesValidLetters = false
                }
            }

            // Do not execute below code if fails previous tests
            let isWord = false
            if (usesValidLetters = true) {
                // Validate if it is a valid word
                isWord = await checkIfWord(playerResponse)
                if (isWord == true) {
                    guessedWords.push(playerResponse)
                    // Checking if the response if the correct word
                    if (playerResponse.toLowerCase() == randomWord.toLowerCase()) {
                        correctAnswer = true
                    } else {
                        console.log("Incorrect, please guess again.")
                    }
                } else {
                    // Not sure if I should add non-words to the list, instructions are nto clear
                    console.log(playerResponse + " is not a valid word")
                }
            }
        }
    }

    // ask if they want to try again
    inquirer
        .prompt([
            {
            type: 'list',
            name: 'playAgain',
            message: 'Would you like to play again?',
            choices: ['Yes', 'No'],
            },
        ])
        .then(answers => {
            if (answers.playAgain == 'Yes') {
                anagramsGame()
            }
        });
}

await anagramsGame()