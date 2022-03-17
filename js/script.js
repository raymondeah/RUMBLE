const targetWords = [
    "falco",
    "sasha",
    "conny"
];

const wordBank = [
    "armin",
    "hange",
    "conny",
    "varis",
    "sasha",
    "braus",
    "lobov",
    "erwin",
    "smith",
    "marlo",
    "tomas",
    "klaus",
    "lauda",
    "keiji",
    "lynne",
    "petra",
    "moses",
    "waltz",
    "hitch",
    "boris",
    "roger",
    "kenny",
    "caven",
    "duran",
    "pyxis",
    "keith",
    "marco",
    "franz",
    "kefka",
    "carlo",
    "calvi",
    "annie",
    "pieck",
    "falco",
    "grice",
    "porco",
    "zofia",
    "xaver",
    "gross",
    "reiss",
    "fritz",
    "tybur",
    "willy",
    "maria",
    "ellie",
    "artur",
    "carly",
    "ralph",
    "sunny",
    "carla",
    "floch",
    "beane",
    "helos",

    "titan"
];

const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;
const keyboard = document.querySelector("[data-keyboard]");
const alertContainer = document.querySelector("[data-alert-container]");
const guessGrid = document.querySelector("[data-guess-grid]");
const puzzleNumber = document
    .querySelector("#settings")
    .querySelector(".menucontents")
    .querySelector(".number");

const startingDate = new Date(2022, 2, 17);
const offsetDate = Date.now() - startingDate;
const currentDay = Math.floor(offsetDate / 1000 / 60 / 60 / 24);
const targetWord = targetWords[currentDay];

puzzleNumber.textContent = '#' + (currentDay+1);

//localStorage.clear();
const expireDate = localStorage.getItem('expire date');
const guessGridPrev = localStorage.getItem('grid');
const keyboardPrev = localStorage.getItem('keyboard');

// STATS PAGE!!! //
const today = new Date();
if (today.getDay === startingDate.getDay && today.getFullYear === startingDate.getFullYear) {
    localStorage.setItem('games played', 0);
    localStorage.setItem('games won', 0);
    localStorage.setItem('current streak', 0);
    localStorage.setItem('max streak', 0);
} 
const gamesPlayed = parseInt(localStorage.getItem('games played'));
const gamesWon = parseInt(localStorage.getItem('games won'));
const currStreak = parseInt(localStorage.getItem('current streak'));
const maxStreak = parseInt(localStorage.getItem('max streak'));
// STATS PAGE!!! //

if (expireDate && Date.parse(expireDate) < Date.now()) {
    localStorage.removeItem('grid');
    localStorage.removeItem('keyboard');
    localStorage.removeItem('W');
} else {
    if (guessGridPrev) {
        hideHelp(0);
        guessGrid.innerHTML = guessGridPrev;
    }
    if (keyboardPrev) {
        keyboard.innerHTML = keyboardPrev;
    }
}
//localStorage.setItem('guess grid', guessGrid.innerHTML);
//localStorage.setItem('keyboard', keyboard.innerHTML);
//let targetWord = targetWords[0];

// DATE RESET!!! //

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0);
tomorrow.setMinutes(0);
tomorrow.setSeconds(0);
localStorage.setItem('expire date', tomorrow);

// DATE RESET!!! //

const alreadyWon = localStorage.getItem('W');
if (alreadyWon) {
    stopInteraction;
} else {
    startInteraction();
}


function startInteraction() {
    document.addEventListener("click", handleMouseClick);
    document.addEventListener("keydown", handleKeyPress);
}

function stopInteraction() {
    document.removeEventListener("click", handleMouseClick);
    document.removeEventListener("keydown", handleKeyPress);
}

function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
        pressKey(e.target.dataset.key);
        return;
    }

    if (e.target.matches("[data-enter]")) {
        submitGuess();
        return;
    }

    if (e.target.matches("[data-delete]")) {
        deleteKey();
        return;
    }
}

function handleKeyPress(e) {
    if (e.key === "Enter") {
        submitGuess();
        return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
        deleteKey();
        return;
    }

    if (e.key.match(/^[a-z]$/)) {
        pressKey(e.key);
        return;
    }
}

function pressKey(key) {
    const activeTiles = getActiveTiles();
    if (activeTiles.length >= WORD_LENGTH) return;
    const nextTile = guessGrid.querySelector(":not([data-letter])");
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = "active";
}

function deleteKey() {
    const activeTiles = getActiveTiles();
    const lastTile = activeTiles[activeTiles.length - 1];
    if (lastTile == null) return;
    lastTile.textContent = "";
    delete lastTile.dataset.state;
    delete lastTile.dataset.letter;
}

function submitGuess() {
    const activeTiles = [...getActiveTiles()];
    if (activeTiles.length !== WORD_LENGTH) {
        showAlert("Not enough letters");
        shakeTiles(activeTiles);
        return;
    }

    const guess = activeTiles.reduce((word, tile) => {
        return word + tile.dataset.letter
    }, "")

    if (!wordBank.includes(guess)) {
        showAlert("Not in word list");
        shakeTiles(activeTiles);
        return;
    }

    stopInteraction();
    //activeTiles.forEach((...params) => flipTile(...params, guess));
    let s = flipTiles(activeTiles);

    for (let i = 0; i < s.length; i++) {
        flipTile(s[i], guess, activeTiles);
    }
    //s.forEach(() => flipTile(guess, activeTiles));

    //flipTiles(activeTiles, guess);
}

// function flipTiles(tiles, guess) {
//     let withoutCorrect = targetWord;

//     for (let i = 0; i < tiles.length; i++) {
//         const tile = tiles[i];
//         const letter = tile.dataset.letter;
//         // console.log(letter, ' ', targetWord[i]);
//         const key = keyboard.querySelector(`[data-key="${letter}"i]`);

//         if (targetWord[i] === letter) {
//             tile.dataset.state = "correct";
//             key.classList.add("correct");
//             withoutCorrect = withoutCorrect.replace(letter, '');
//         }
//     }

//     for (let i = 0; i < tiles.length; i++) {
//         const tile = tiles[i];
//         const letter = tile.dataset.letter;
//         const key = keyboard.querySelector(`[data-key="${letter}"i]`);

//         if (tile.dataset.state === "correct") {
//             continue;
//         } else if (withoutCorrect.includes(letter)) {
//             tile.dataset.state = "wrong-location";
//             key.classList.add("wrong-location");
//             withoutCorrect = withoutCorrect.replace(letter, '');
//         }
//     }

//     for (let i = 0; i < tiles.length; i++) {
//         const tile = tiles[i];
//         const letter = tile.dataset.letter;
//         const key = keyboard.querySelector(`[data-key="${letter}"i]`);

//         if (tile.dataset.state === "correct" || tile.dataset.state === "wrong-location") {
//             continue;
//         } else {
//             tile.dataset.state = "wrong";
//             key.classList.add("wrong");
//         }
//     }

//     startInteraction();
//     checkWinLose(guess, tiles);
// }

function flipTiles(tiles) {
    let states = [];
    let withoutCorrect = targetWord;

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const letter = tile.dataset.letter;
        // console.log(letter, ' ', targetWord[i]);
        const key = keyboard.querySelector(`[data-key="${letter}"i]`);

        if (targetWord[i] === letter) {
            states.push([tile, key, "correct", i]);
            withoutCorrect = withoutCorrect.replace(letter, '');
        } else {
            states.push([tile, key, "", i]);
        }
    }

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const letter = tile.dataset.letter;
        const key = keyboard.querySelector(`[data-key="${letter}"i]`);

        if (states[i][2] === "correct") {
            continue;
        } else if (withoutCorrect.includes(letter)) {
            states[i][2] = "wrong-location";
            withoutCorrect = withoutCorrect.replace(letter, '');
        }
    }

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const letter = tile.dataset.letter;
        const key = keyboard.querySelector(`[data-key="${letter}"i]`);

        if (states[i][2] === "correct" || states[i][2] === "wrong-location") {
            continue;
        } else {
            states[i][2] = "wrong";
        }
    }

    return states;
}

/*
1. iterate through and label correct letters, remove from target word
2. iterate through again and label yellow/gray
3. reset target word
*/

function flipTile(states, guess, activeTiles) {
    const tile = states[0];
    const key = states[1];
    const operation = states[2];
    const index = states[3];

    setTimeout(() => {
        tile.classList.add("flip");
    }, index * FLIP_ANIMATION_DURATION / 2);

    tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");
        if (operation === "correct") {
            tile.dataset.state = "correct";
            key.classList.add("correct");
        } else if (operation == "wrong-location") {
            tile.dataset.state = "wrong-location";
            key.classList.add("wrong-location");
        } else {
            tile.dataset.state = "wrong";
            key.classList.add("wrong");
        }

        if (index === WORD_LENGTH - 1) {
            tile.addEventListener("transitionend", () => {
                startInteraction();
                checkWinLose(guess, activeTiles);
                localStorage.setItem('grid', document.querySelector("[data-guess-grid]").innerHTML);
                localStorage.setItem('keyboard', document.querySelector("[data-keyboard]").innerHTML);
            }, { once: true });
        }
    }, { once: true});
}

function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]');
}

function showAlert(message, duration = 1000) {
    const alert = document.createElement("div");
    alert.textContent = message;
    alert.classList.add("alert");
    alertContainer.prepend(alert);
    if (duration == null) return;
    
    setTimeout(() => {
        alert.classList.add("hide");
        alert.addEventListener("transitionend", () => {
            alert.remove();
        });
    }, duration);
}

function shakeTiles(tiles) {
    tiles.forEach(tile => {
        tile.classList.add("shake");
        tile.addEventListener(
            "animationend", 
            () => {
            tile.classList.remove("shake");
            }, 
            { once: true}
        )
    });
}

function checkWinLose(guess, tiles) {
    const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])");
    const currRow = 6 - (remainingTiles.length / WORD_LENGTH);
    const winMessages = ['genius', 'magnificent', 'impressive', 'splendid', 'great', 'phew'];

    if (guess === targetWord) {
        //genius magnificent impressive splendid great phew
        showAlert(winMessages[currRow - 1], 3000);
        danceTiles(tiles);
        localStorage.setItem('W', 'T');
        stopInteraction();
        localStorage.setItem('games played', gamesPlayed + 1);
        localStorage.setItem('games won', gamesWon + 1);
        localStorage.setItem('current streak', currStreak + 1);
        if (currStreak + 1 > maxStreak) {
            localStorage.setItem('max streak', currStreak + 1);
        }
        return;
    }

    
    if (remainingTiles.length === 0) {
        showAlert(targetWord.toUpperCase(), null);
        stopInteraction();
        localStorage.setItem('games played', gamesPlayed + 1);
        return;
    }


    // const gamesPlayed = localStorage.getItem('games played');
    // const gamesWon = localStorage.getItem('games won');
    // const currStreak = localStorage.getItem('current streak');
    // const maxStreak = localStorage.getItem('max streak');
    // const wonYesterday = localStorage.getItem('won yesterday?');
}

function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add("dance");
            tile.addEventListener(
                "animationend", 
                () => {
                tile.classList.remove("dance");
                }, 
                { once: true}
            )
        }, index * DANCE_ANIMATION_DURATION / 5);
    });
}


/////////////////////////////////////////////////////////////

function showHelp() {
    const box = document.getElementById("help");
    box.style.animationName = 'show'
    box.style.animationDuration = '250ms'
    box.style.animationTimingFunction = 'ease-out'
    box.style.animationFillMode = 'forwards';
}

function hideHelp(duration) {
    const box = document.getElementById("help");
    box.style.animationName = 'hide'
    box.style.animationDuration = duration + 'ms';
    box.style.animationTimingFunction = 'ease-out'
    box.style.animationFillMode = 'forwards';
}

function showSettings() {
    const box = document.getElementById("settings");
    box.style.animationName = 'show'
    box.style.animationDuration = '250ms'
    box.style.animationTimingFunction = 'ease-out'
    box.style.animationFillMode = 'forwards';
}

function hideSettings() {
    const box = document.getElementById("settings");
    box.style.animationName = 'hide'
    box.style.animationDuration = '250ms'
    box.style.animationTimingFunction = 'ease-out'
    box.style.animationFillMode = 'forwards';
}