const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');

let startTime = 0;
let elapsedBeforeStart = 0;
let timerId = null;
let lapCount = 0;

function formatTime(milliseconds, includeSpan = false) {
    const totalCentiseconds = Math.floor(milliseconds / 10);
    const centiseconds = totalCentiseconds % 100;
    const totalSeconds = Math.floor(totalCentiseconds / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    const main = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const frac = String(centiseconds).padStart(2, '0');
    return includeSpan ? `${main}<span class="fraction">.${frac}</span>` : `${main}.${frac}`;
}


function renderDisplay() {
    const elapsed = elapsedBeforeStart + (timerId ? (Date.now() - startTime) : 0);
    display.innerHTML = formatTime(elapsed, true);
}

function setButtonStates(isRunning) {
    startStopBtn.textContent = isRunning ? 'Stop' : 'Start';
    lapBtn.disabled = !isRunning;
}

function toggleStartStop() {
    if (timerId === null) {
        // start
        startTime = Date.now();
        timerId = setInterval(renderDisplay, 10);
        setButtonStates(true);
    } else {
        // stop
        elapsedBeforeStart += Date.now() - startTime;
        clearInterval(timerId);
        timerId = null;
        renderDisplay();
        setButtonStates(false);
    }
}


function addLap() {
    if (timerId === null) {
        return;
    }

    lapCount += 1;
    const lapItem = document.createElement('li');
    const elapsed = elapsedBeforeStart + (timerId ? (Date.now() - startTime) : 0);
    lapItem.innerHTML = `Lap ${lapCount}: ${formatTime(elapsed, true)}`;

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

startStopBtn.addEventListener('click', toggleStartStop);
lapBtn.addEventListener('click', addLap);
resetBtn.addEventListener('click', resetStopwatch);

renderDisplay();
setButtonStates(false);
