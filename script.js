// List Words
const wordList = 'in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present another by few come that down last or use say take would each even govern play around back under some line think she even when from do real problem between long as there school do as mean to all on other good may from might call world thing life turn of he look last problem after get show want need thing old other during be again develop come from consider the now number say life interest to system only group world same state school one problem between for turn run at very against eye must go both still all a as so after play eye little be those should out after which these both much house become both school this he real and may mean time by real number other as feel at end ask plan come turn by all head increase he present increase use stand after see order lead than system here ask in of look point little too without each for both but right we come world much own set we right off long those stand go both but under now must real general then before with much those at no of we only back these person plan from run new as own take early just increase only look open follow get that on system the mean plan man over it possible if most late line would first without real hand say turn point small set at in system however to be home show new again come under because about show face child know person large program how over could thing from out world while nation stand part run have look what many system order some one program you great could write day do he any also where child late face eye run still again on by as call high the must by late little mean never another seem to leave because for day against public long number word about after much need open change also'.split(' ');

// Elements
const words = document.getElementById("words");
const game = document.getElementById("game");
const cursor = document.getElementById("cursor");
const info = document.getElementById("info");

const wordLeng = wordList.length;
const gameTime = 9*1000;

window.timer = null;
window.gameStart = null;

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
    game.classList.add("start")
    if(game.classList.contains('over')) {
        game.classList.replace('over', 'start');
    }

    words.innerHTML = "";
    for(let i = 0; i < 200; i++){
        words.innerHTML += formatWord(randomWord());
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    window.timer = null;
}

function getWpm() {
    const words = [...document.querySelectorAll(".word")];
    const lastTypedWord = document.querySelector(".word.current");
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetter = letters.filter(letter => letter.classList.contains("incorrect"));
        const correctLetter = letters.filter(letter => letter.classList.contains("correct"));
        return incorrectLetter.length === 0 && correctLetter.length === letters.length;
    })
    return Math.round(correctWords.length / gameTime * 60000);
}
function gameOver() {
    clearInterval(window.timer);
    game.classList.replace('start','over');
    const result = getWpm();
    document.getElementById('info').innerHTML = `WPM: ${result}`;
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

    if(document.querySelector('#game.over')) return
    
    console.log({key, expected});

    if (!window.timer && isLetter) {
        document.getElementById('info').innerHTML = gameTime/1000 + 1;
        window.timer = setInterval(() => {
          if (!window.gameStart) {
            window.gameStart = (new Date()).getTime();
          }
          const currentTime = (new Date()).getTime();
          const msPassed = currentTime - window.gameStart;
          const sPassed = Math.round(msPassed / 1000);
          const sLeft = Math.round((gameTime / 1000) - sPassed);
          if (sLeft <= 0) {
            gameOver();
            return;
          }
          document.getElementById('info').innerHTML = sLeft + '';
        }, 1000);
      }
    

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

document.getElementById('newGameBtn').addEventListener('click', () => {
    gameOver();
    newGame();
});

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