const randomQuoteURL = "http://api.quotable.io/random";
const container = document.getElementById("container");
const quoteDisplayElement = document.getElementById("quote");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");

var timerID;
var isTimerStated = false;
var quote;
var currentIndex = 0;
var strokes;
let count;
window.addEventListener("click", (e) => {
    if (document.getElementById("container").contains(e.target)) {
        if (!isTimerStated) {
            container.classList.add("container-focus");
            startTimer();
        }
    } else {
        container.classList.remove("container-focus");
        count = 0;
        timerElement.innerText = 0;
        stopTimer();
        currentIndex = 0;
        resetStrokes();
        quoteDisplayElement.childNodes.forEach((node) => {
            node.classList.remove("correct");
            node.classList.remove("incorrect");
        });
    }
});

function calcualtewpm() {
    if (getTimerTime() > 0) {
        wpmElement.innerText = Math.round(
            parseFloat(correctStrokes()) /
                5.0 /
                (parseFloat(getTimerTime()) / 60.0)
        );
    }
}

window.addEventListener("keydown", (e) => {
    if (e.key === "Shift" || e.key === "CapsLock" || e.key === "Alt") return;
    if (e.key == "Backspace") {
        if (currentIndex === 0) return;
        currentIndex--;
        if (
            quoteDisplayElement.childNodes[currentIndex].classList.contains(
                "correct"
            )
        )
            count--;
        quoteDisplayElement.childNodes[currentIndex].classList.remove(
            "correct"
        );
        quoteDisplayElement.childNodes[currentIndex].classList.remove(
            "incorrect"
        );
        return;
    }
    console.log(count);
    if (isTimerStated) {
        if (true) {
            if (quote[currentIndex] == e.key) {
                quoteDisplayElement.childNodes[currentIndex].classList.add(
                    "correct"
                ); // green
                quoteDisplayElement.childNodes[currentIndex].classList.remove(
                    "incorrect"
                );
                strokes[currentIndex] = 1;
            } else {
                quoteDisplayElement.childNodes[currentIndex].classList.add(
                    "incorrect"
                );
                quoteDisplayElement.childNodes[currentIndex].classList.remove(
                    "correct"
                );
                strokes[currentIndex] = 0;
            }
            calcualtewpm();
            currentIndex++;
            if (currentIndex === quote.length) {
                currentIndex = 0;
                renderNewQuote();
            }
        }
    }
});

const getRandomQuote = () => {
    count = 0;
    return fetch(randomQuoteURL)
        .then((response) => response.json())
        .then((data) => data.content);
};

function resetStrokes() {
    for (let i = 0; i < strokes.length; i++) {
        strokes[i] = 0;
    }
}

function correctStrokes() {
    count = 0;
    strokes.forEach((stroke) => {
        if (stroke) count++;
    });
    return count;
}

const renderNewQuote = async () => {
    quote = await getRandomQuote();
    if (isTimerStated) {
        stopTimer();
        startTimer();
    }
    currentIndex = 0;
    strokes = new Array(quote.length);
    strokes.fill(0);
    quoteDisplayElement.innerHTML = "";
    quote.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.innerText = char;
        quoteDisplayElement.appendChild(charSpan);
    });
};

let startTime;

function startTimer() {
    isTimerStated = true;
    timerElement.innerText = 0;
    startTime = new Date();
    timerID = setInterval(() => {
        timer.innerText = getTimerTime();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function stopTimer() {
    isTimerStated = false;
    clearInterval(timerID);
}

renderNewQuote();
