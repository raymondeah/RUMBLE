document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [[]];
    let availableSpace = 1;

    let word = "penis";
    let guessedWordCount = 0

    const keys = document.querySelectorAll(".keyboard-row button");

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1]
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }
    }

    function removeLetter() {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length > 0) {
            currentWordArr.pop();

            const availableSpaceEl = document.getElementById(String(availableSpace-1));
            availableSpace = availableSpace - 1;

            availableSpaceEl.textContent = "";
        }
    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter);

        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr()
        const firstLetterId = guessedWordCount * 5 + 1;
        for (let i = firstLetterId; i < firstLetterId + 5; i++) {
            const letterEl = document.getElementById(i);
            letterEl.classList.remove("animate__shakeX")
        }
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");
            for (let i = firstLetterId; i < firstLetterId + 5; i++) {
                const letterEl = document.getElementById(i);
                letterEl.classList.add("animate__shakeX");
            }
            return;
        }

        const currentWord = currentWordArr.join('');

        //const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 400;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            }, interval * index)
        })

        guessedWordCount += 1;

        if (currentWord === word) {
            window.alert("Congratulations!");
        }

        if (guessedWords.length === 6) {
            window.alert(`You Lost! The word is ${word}`);
        }

        guessedWords.push([])
    }

    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let i = 0; i < 30; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", i + 1);
            gameBoard.appendChild(square);
        }  
    }

    for (let j = 0; j < keys.length; j++) {
        keys[j].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");
            
            if (letter === 'enter') {
                handleSubmitWord();
                return;
            }

            if (letter == 'del') {
                removeLetter();
                return;
            }

            updateGuessedWords(letter);
        }
    }
})