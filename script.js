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

game.addEventListener("keydown", ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    const isExtra = document.querySelector(".letter.incorrect.extra");

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
    else if(isSpace){
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
   
    else if (isBackspace) {
        if (isExtra) {
          isExtra.remove();
        }
        else if (currentLetter && isFirstLetter) {
            // make prev word current, last letter current
            removeClass(currentWord, 'current');
            removeClass(currentLetter, 'current');
            if(currentWord.previousSibling){
                addClass(currentWord.previousSibling, 'current');
                addClass(currentWord.previousSibling.lastChild, 'current');
                removeClass(currentWord.previousSibling.lastChild, 'incorrect');
                removeClass(currentWord.previousSibling.lastChild, 'correct');
            }
        }
        else if (currentLetter && !isFirstLetter) {
            // move back one letter, invalidate letter
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        else if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
        
    }

    // move lines / words (scrolling next)
    // if (currentWord.getBoundingClientRect().top > 280) {
    //     const words = document.getElementById('words');
    //     const margin = parseInt(words.style.marginTop || '0px');
    //     words.style.marginTop = `${margin - 35}px`;
    //     // words.style.marginTop = 
    // }

    // make the content / words or lines to auto scroll whenever the user types and gets to the bottom
    const words = document.getElementById('words');
    const margin = parseInt(words.style.marginTop || '0px');
    if (currentWord.getBoundingClientRect().top > 280) {
        words.style.marginTop = `${margin - 35}px`;
    }
    if(currentWord.getBoundingClientRect().top < 0){
        words.style.marginTop = '0px';
    }




    // cursor move
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    cursor.style.position = 'fixed';
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + "px";
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? "left" : "right"] + "px";

})

newGame();



// const paragraphs = [
//     "One dollar and eighty-seven cents. That was all. And sixty cents of it was in pennies. Pennies saved one and two at a time by bulldozing the grocer and the vegetable man and the butcher until one’s cheeks burned with the silent imputation of parsimony that such close dealing implied. One dollar and eighty-seven cents. And the next day would be Christmas...",
//     "There was a leak in the boat. Nobody had yet noticed it, and nobody would for the next couple of hours. This was a problem since the boat was heading out to sea and while the leak was quite small at the moment, it would be much larger when it was ultimately discovered. John had planned it exactly this way.",
//     "The paper was blank. It shouldn't have been. There should have been writing on the paper, at least a paragraph if not more. The fact that the writing wasn't there was frustrating. Actually, it was even more than frustrating. It was downright distressing.", "The coin hovered in the air, spinning over and over again. It reached its peak and began to descend. Both boys were pleading with it to land a certain way but the coin had already made up its mind on what it was going to do.",
//     "I'll talk to you tomorrow in more detail at our meeting, but I think I've found a solution to our problem. It's not exactly legal, but it won't land us in jail for the rest of our lives either. Are you willing to take the chance? Monroe asked his partner over the phone.",
//     "There was a time when he would have embraced the change that was coming. In his youth, he sought adventure and the unknown, but that had been years ago. He wished he could go back and learn to find the excitement that came with change but it was useless. That curiosity had long left him to where he had come to loathe anything that put him out of his comfort zone."
// ];

// const typingText = document.querySelector(".typing-text p"),
//     inpField = document.querySelector(".wrapper .input-field"),
//     tryAgainBtn = document.querySelector(".content button"),
//     timeTag = document.querySelector(".timeLeft span b"),
//     errorTag = document.querySelector(".errors span"),
//     wpmTag = document.querySelector(".wpm span"),
//     cpmTag = document.querySelector(".cpm span");

// let timer,
//     maxTime = 60,
//     timeLeft = maxTime,
//     charIndex = errors = isTyping = 0;

// function loadParagraph() {
//     const ranIndex = Math.floor(Math.random() * paragraphs.length);
//     typingText.innerHTML = "";
//     paragraphs[ranIndex].split("").forEach(char => {
//         let span = `<span>${char}</span>`
//         typingText.innerHTML += span;
//     });
//     typingText.querySelectorAll("span")[0].classList.add("active");
//     document.addEventListener("keydown", () => inpField.focus());
//     typingText.addEventListener("click", () => inpField.focus());
// }

// function initTyping() {
//     let characters = typingText.querySelectorAll("span");
//     let typedChar = inpField.value.split("")[charIndex];
//     if (charIndex < characters.length - 1 && timeLeft > 0) {
//         if (!isTyping) {
//             timer = setInterval(initTimer, 1000);
//             isTyping = true;
//         }
//         if (typedChar == null) {
//             if (charIndex > 0) {
//                 charIndex--;
//                 if (characters[charIndex].classList.contains("incorrect")) {
//                     errors--;
//                 }
//                 characters[charIndex].classList.remove("correct", "incorrect");
//             }
//         } else {
//             if (characters[charIndex].innerText == typedChar) {
//                 characters[charIndex].classList.add("correct");
//             } else {
//                 errors++;
//                 characters[charIndex].classList.add("incorrect");
//             }
//             charIndex++;
//         }
//         characters.forEach(span => span.classList.remove("active"));
//         characters[charIndex].classList.add("active");

//         let wpm = Math.round(((charIndex - errors) / 5) / (maxTime - timeLeft) * 60);
//         wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

//         wpmTag.innerText = wpm;
//         errorTag.innerText = errors;
//         cpmTag.innerText = charIndex - errors;
//     } else {
//         clearInterval(timer);
//         inpField.value = "";
//     }
// }

// function initTimer() {
//     if (timeLeft > 0) {
//         timeLeft--;
//         timeTag.innerText = timeLeft;
//         let wpm = Math.round(((charIndex - errors) / 5) / (maxTime - timeLeft) * 60);
//         wpmTag.innerText = wpm;
//     } else {
//         clearInterval(timer);
//     }
// }

// function resetTest() {
//     loadParagraph();
//     clearInterval(timer);
//     timeLeft = maxTime;
//     charIndex = errors = isTyping = 0;
//     inpField.value = "";
//     timeTag.innerText = timeLeft;
//     wpmTag.innerText = 0;
//     errorTag.innerText = 03;
//     cpmTag.innerText = 0;
// }

// loadParagraph();
// inpField.addEventListener("input", initTyping);
// tryAgainBtn.addEventListener("click", resetTest);