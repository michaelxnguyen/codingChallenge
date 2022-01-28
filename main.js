/// Create a game to unscramble letters (anagrams)
/// STARTED AT 5:10, FINISH BY 10
/// if theres extra time, add hints, check against a dictionary api

import inquirer from "inquirer"
import fetch from "node-fetch"

async function askForPlayerResponse(promptWord, guessList) {
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

function anagramsGame() {
    let correctAnswer = false
    /// Greet the user
    console.log("Welcome to anagrams")
    /// Display Instructions
    console.log(`The letters of a random word are displayed. Type in your guess for the word and hit ENTER. If your guess is correct, you win. If your guess is incorrect, it will be added to the list and you will be prompted to guess again.`)
    /// Call word generator api to get a word https://random-word-api.herokuapp.com/word?number=1 (returns array with number of words requested [we specified 1])
    let randomWord
    fetch("https://random-word-api.herokuapp.com/word?number=1").then(async (response) => {
        return response.json()
    }).then( async (data) => {
        /// make this async, so it will not try to respond prior to the word arriving (returning undefined)
        randomWord = data[1]
        console.log(data)
    }).catch(async () => {
        console.log("Something went wrong when retrieving your word")
    })
    console.log("Your random word is " + randomWord)
    /// Scramble the word
    let wordLetters = randomWord.split("")
    /// Alternate Shuffle code, less random than Fisher-Yates (if i cannot get it to work)
    let shuffledArray = array.sort((a, b) => 0.5 - Math.random())
    let shuffledWord = shuffledArray.join("")
    /// Using the Fisher-Yates algorithm to randomize the letters
    // let shuffledLetters = wordLetters => {
    //     for (i = wordLetters.length() -1; i >0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1))
    //         /// below we shuffle around the array object posistions using the random letters
    //         const temp = wordLetters[i]
    //         wordLetters[i] = wordLetters[j]
    //         wordLetters[j] = temp 
    //     }
    // }
    // shuffledLetters()
    // console.log(wordLetters)

    /// Allow for player word entry
    let playerResponse
    while (correctAnswer == false) {
        playerResponse = await askForPlayerResponse(shuffledWord)
        /// Validate that the word is not a duplicate
        /// Validate that it only uses the letters allowed (split both strings, compare letters?)
        /// Validate if it is a valid word (doesn't need all letters) https://dictionaryapi.dev/
        /// allow for submission until the correct word is guessed
    }
    /// ask if they want to try again
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

anagramsGame()