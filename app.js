// Global Routing State Variables
const selectionScreen = document.getElementById('album-selection');
const earthWorkspace = document.getElementById('earth-workspace');
const statusDisplay = document.getElementById('status-display');
const playbackControls = document.getElementById('playback-controls');
const activeTitle = document.getElementById('active-region-title');
const dataLog = document.getElementById('data-log');

// Web Audio API Variables
let audioCtx = null;
let currentInterval = null;
let isPlaying = false;

// An Pentatonic Musical Scale Pool mapping to specific frequencies (Hz)
// Keeps the generated data sonification sounding beautifully melodic (cinematic)
const scalePool = [
    110.00, // A2
    130.81, // C3
    146.83, // D3
    164.81, // E3
    196.00, // G3
    220.00, // A3
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99  // G5
];

function selectAlbum(album) {
    if (album === 'earth') {
        selectionScreen.classList.add('hidden');
        earthWorkspace.classList.remove('hidden');
    }
}

function goBackToAlbums() {
    stopAudioEngine();
    earthWorkspace.classList.add('hidden');
    selectionScreen.classList.remove('hidden');
}

// Data Synthesizer Sequence Loop Implementation
function sonifyRegion(regionName) {
    stopAudioEngine(); // Clear existing loops before starting a new region
    
    // Lazy initialize context to fulfill browser security rules on click
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    statusDisplay.classList.add('hidden');
    playbackControls.classList.remove('hidden');
    activeTitle.innerText = `Album: Earth | Track: Data Vector of ${regionName}`;
    
    isPlaying = true;
    
    // Simulate raw climate datasets (100 sequential measurement years)
    let currentYear = 1926;
    let baselineTemp = 0.0;
    
    // Localized climate models per user selection parameter
    const regionalModifiers = {
        'North America': 0.022,
        'Europe': 0.028,
        'Asia': 0.019,
        'Africa': 0.012,
        'South America': 0.015
    };
    
    const warmingRate = regionalModifiers[regionName] || 0.015;

    // Run clock step loop generating 1 musical note every 400ms
    currentInterval = setInterval(() => {
        if (currentYear > 2026) {
            currentYear = 1926; // Loop back data tracking loop
            baselineTemp = 0.0;
        }

        // Apply global warming vector addition with natural year variations
        baselineTemp += warmingRate + (Math.random() * 0.1 - 0.045);
        
        // Map current calculated value limits directly into our array index scale bounds
        let index = Math.floor(((baselineTemp + 0.5) / 3.0) * scalePool.length);
        index = Math.max(0, Math.min(index, scalePool.length - 1));
        const finalFrequency = scalePool[index];

        // Terminal Console Log tracking inside UI interface component
        dataLog.innerText = `[Year: ${currentYear}] Raw Anomaly: +${baselineTemp.toFixed(3)}°C | Mapped Pitch Frequency: ${finalFrequency} Hz`;

        // Sound Synthesis Generation Action Node Pipeline
        playSynthNote(finalFrequency);

        currentYear++;
    }, 400);
}

function playSynthNote(frequency) {
    if (!audioCtx) return;

    // Custom Synthesizer Component Setup
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'triangle'; // Pure, warm musical tone ideal for tracking signals
    oscillator.frequency.value = frequency;

    // Smooth ADSR Volume Envelope Automation preventing audio cracks/pops
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.05); // Attack phase
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35); // Decay/Sustain

    // Wire component matrices out directly to speakers
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.4);
}

function togglePlayback() {
    if (isPlaying) {
        stopAudioEngine();
        dataLog.innerText = "Audio stream engine manually suspended.";
        document.getElementById('audio-toggle-btn').innerText = "Restart Data Stream";
        document.getElementById('audio-toggle-btn').className = "btn-action restart-style";
    } else {
        document.getElementById('audio-toggle-btn').innerText = "Stop Audio Generation";
        document.getElementById('audio-toggle-btn').className = "btn-action";
        // Re-read active track context name tracking parameters
        const match = activeTitle.innerText.match(/Vector of (.*)/);
        if (match && match[1]) sonifyRegion(match[1]);
    }
}

function stopAudioEngine() {
    isPlaying = false;
    if (currentInterval) {
        clearInterval(currentInterval);
        currentInterval = null;
    }
}
