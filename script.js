// List Words
const wordList = 'Hello! I think you did a great job with this video! I have a question though, I was looking through the comment section and found the comment noticing the bug and the solution to delete a previous child when it is incorrect, it worked for me flawlessly. Although, I am running into a similar issue when I hit the space bar after typing in a incorrect key that it does not erase the previous value that you input on the previous word. For example: if the word is there and I type theree and backspace to try to delete it, it will change the word to theree as the correct value when you try to go to the next word. Not sure if that made sense. I hope it did. Any solution to this problem? I have been trying to debug this for a couple days now (I am a beginner) and would like some help. Any help is appreciated. Thank you again for your hard work!'.split(" ")


// Elements
const words = document.getElementById("words")
const game = document.getElementById("game")
const cursor = document.getElementById("cursor")

const wordLeng = wordList.length

// Functions

function addClass(element, name){
    element.className += " " + name;
}
function removeClass(element, name){
    element.className = element.className.replace(name, "");
}

function randomWord(){
    const randomIndex = Math.ceil(Math.random()*wordLeng)
    return wordList[randomIndex - 1]
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}
function newGame(){
    words.innerHTML = "";
    for(let i = 0; i < 200; i++){
        words.innerHTML += formatWord(randomWord());
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
}

game.addEventListener("keyup", ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';

    console.log({key, expected});

    if(isLetter){
        if(currentLetter){
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current')
            if(currentLetter.nextSibling){
                addClass(currentLetter.nextSibling, 'current');
            }

        } else{
            const incorrectLetter = document.createElement( "span" );
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = "letter incorrect extra";
            currentWord.appendChild(incorrectLetter)
        }
    }
    if(isSpace){
        if(expected !== ' '){
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            })
        }
       
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if(currentLetter){
            removeClass(currentLetter, "current");
        }
        addClass(currentWord.nextSibling.firstChild, "current");
    }
    if (isBackspace) {
        if(currentLetter){
            const prevSibling = currentLetter.previousSibling;
            removeClass(currentLetter, 'current', 'correct', 'incorrect');
            if (prevSibling) {
                addClass(prevSibling, 'current');
                removeClass(prevSibling, 'correct', 'incorrect');
            }
        }
        if(currentWord.previousSibling && currentWord.firstChild.className === 'word current'){
            removeClass(currentWord, 'correct', 'incorrect');
            removeClass(currentWord.firstChild, 'correct', 'incorrect');
            addClass(currentWord.previousSibling, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
        }
        if(currentWord.lastChild.className !== "letter current"){
            removeClass(currentWord.lastChild, 'correct', 'incorrect');
            addClass(currentWord.lastChild, 'current');
        }
        
    }

    // cursor move
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    cursor.style.position = 'fixed';
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + "px";
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? "left" : "right"] + "px";

})

newGame();