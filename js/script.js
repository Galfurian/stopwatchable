const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');

let startTime = 0;
let elapsedBeforeStart = 0;
let timerId = null;
let lapCount = 0;

function formatTime(milliseconds) {
    const totalCentiseconds = Math.floor(milliseconds / 10);
    const centiseconds = totalCentiseconds % 100;
    const totalSeconds = Math.floor(totalCentiseconds / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

function getElapsedTime() {
    if (timerId === null) {
        return elapsedBeforeStart;
    }

    return elapsedBeforeStart + (Date.now() - startTime);
}

function renderDisplay() {
    display.textContent = formatTime(getElapsedTime());
}

function setButtonStates(isRunning) {
    startBtn.disabled = isRunning;
    stopBtn.disabled = !isRunning;
    lapBtn.disabled = !isRunning;
}

function startStopwatch() {
    if (timerId !== null) {
        return;
    }

    startTime = Date.now();
    timerId = setInterval(renderDisplay, 10);
    setButtonStates(true);
}

function stopStopwatch() {
    if (timerId === null) {
        return;
    }

    elapsedBeforeStart += Date.now() - startTime;
    clearInterval(timerId);
    timerId = null;
    renderDisplay();
    setButtonStates(false);
}

function addLap() {
    if (timerId === null) {
        return;
    }

    lapCount += 1;
    const lapItem = document.createElement('li');
    lapItem.textContent = `Lap ${lapCount}: ${formatTime(getElapsedTime())}`;

    // Newest lap at the top so it's visible without scrolling.
    lapsList.prepend(lapItem);
}

function resetStopwatch() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }

    startTime = 0;
    elapsedBeforeStart = 0;
    lapCount = 0;
    lapsList.innerHTML = '';
    renderDisplay();
    setButtonStates(false);
}

startBtn.addEventListener('click', startStopwatch);
stopBtn.addEventListener('click', stopStopwatch);
lapBtn.addEventListener('click', addLap);
resetBtn.addEventListener('click', resetStopwatch);

renderDisplay();
setButtonStates(false);
