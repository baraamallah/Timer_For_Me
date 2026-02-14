let timer;
let timeLeft;
let isRunning = false;

const display = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const setTimeBtn = document.getElementById('set-time-btn');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const alarmSound = document.getElementById('alarm-sound');
const container = document.querySelector('.container');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Visual feedback for low time
    if (timeLeft <= 60 && timeLeft > 0) {
        display.classList.add('low-time');
    } else {
        display.classList.remove('low-time');
    }
}

function startTimer() {
    if (isRunning) return;
    if (timeLeft <= 0) return;

    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            timeUp();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetTimer() {
    pauseTimer();
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    timeLeft = (minutes * 60) + seconds;
    updateDisplay();
    container.classList.remove('times-up');
    alarmSound.pause();
    alarmSound.currentTime = 0;
}

function setTime() {
    pauseTimer();
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    timeLeft = (minutes * 60) + seconds;
    updateDisplay();
}

function setPreset(minutes) {
    minutesInput.value = minutes;
    secondsInput.value = 0;
    setTime();
}

function playBeep() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);

    oscillator.start();

    // Pulse effect
    setTimeout(() => {
        gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
        oscillator.stop(audioCtx.currentTime + 0.5);
    }, 1000);
}

function timeUp() {
    display.textContent = "00:00";
    container.classList.add('times-up');

    // Try to play the alarm sound file if it exists, otherwise use beep
    alarmSound.play().catch(e => {
        console.log("Audio file play failed, using Web Audio API beep instead.");
        playBeep();
    });

    setTimeout(() => {
        alert("انتهى الوقت!");
    }, 500);
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
setTimeBtn.addEventListener('click', setTime);

// Initialize
timeLeft = 30 * 60; // Default 30 minutes
updateDisplay();
pauseBtn.disabled = true;
