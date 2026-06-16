// Global Routing State Variables
// Global State Mapping Elements
const selectionScreen = document.getElementById('album-selection');
const workspacePanel = document.getElementById('workspace-panel');
const workspaceTitle = document.getElementById('workspace-title');
const workspaceInstruction = document.getElementById('workspace-instruction');
const dynamicButtonsContainer = document.getElementById('dynamic-buttons');
const statusDisplay = document.getElementById('status-display');
const playbackControls = document.getElementById('playback-controls');
const activeTitle = document.getElementById('active-region-title');
const dataLog = document.getElementById('data-log');
const idleEmoji = document.getElementById('idle-emoji');

let audioCtx = null;
let currentInterval = null;
let isPlaying = false;
let activeAlbum = '';
let activeTarget = '';

// Minor Pentatonic scale used to keep the output beautiful and harmonic
const scalePool = [110.00, 130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

// Dynamic Database Object
const albumData = {
    earth: {
        title: "Earth Album Sub-Regions",
        instruction: "Select a geographic continent vector to process 100-year temperature anomalies.",
        emoji: "🌍",
        themeClass: "earth-theme",
        targets: ["North America", "Europe", "Asia", "Africa", "South America"]
    },
    space: {
        title: "Space Album Cosmic Fields",
        instruction: "Select an astronomical asset to monitor real-time luminosity indices and exoplanet orbit light curves.",
        emoji: "🌌",
        themeClass: "space-theme",
        targets: ["Orion Nebula", "Andromeda Galaxy", "Kepler-186 System", "TRAPPIST-1 System"]
    }
};

function selectAlbum(albumKey) {
    activeAlbum = albumKey;
    const data = albumData[albumKey];
    
    selectionScreen.classList.add('hidden');
    workspacePanel.classList.remove('hidden');
    
    // Set UI styling theme variations
    workspacePanel.className = `workspace ${data.themeClass}`;
    workspaceTitle.innerText = data.title;
    workspaceInstruction.innerText = data.instruction;
    idleEmoji.innerText = data.emoji;

    // Flush and reconstruct context target buttons
    dynamicButtonsContainer.innerHTML = '';
    data.targets.forEach(target => {
        const btn = document.createElement('button');
        btn.className = 'btn-region';
        btn.innerText = target;
        btn.onclick = () => sonifyTarget(target);
        dynamicButtonsContainer.appendChild(btn);
    });
}

function goBackToAlbums() {
    stopAudioEngine();
    workspacePanel.classList.add('hidden');
    selectionScreen.classList.remove('hidden');
    statusDisplay.classList.remove('hidden');
    playbackControls.classList.add('hidden');
}

function sonifyTarget(targetName) {
    stopAudioEngine();
    activeTarget = targetName;

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    statusDisplay.classList.add('hidden');
    playbackControls.classList.remove('hidden');
    activeTitle.innerText = `Active Session: ${activeAlbum.toUpperCase()} // Target: ${targetName}`;
    
    isPlaying = true;
    let clockTicks = 0;

    // Core Logic Routing Loop Node
    currentInterval = setInterval(() => {
        if (activeAlbum === 'earth') {
            runEarthLogic(clockTicks, targetName);
        } else {
            runSpaceLogic(clockTicks, targetName);
        }
        clockTicks++;
    }, 350); // Fast interval cycle speed for sharp response
}

// Earth Processing Node (Linear Rising Global Temp Anomaly Engine)
function runEarthLogic(tick, region) {
    const years = 1926 + (tick % 101);
    const customRates = { 'North America': 0.022, 'Europe': 0.028, 'Asia': 0.019, 'Africa': 0.012, 'South America': 0.015 };
    const rate = customRates[region] || 0.015;
    
    const anomaly = (tick % 101) * rate + (Math.random() * 0.12 - 0.06);
    let index = Math.floor(((anomaly + 0.5) / 3.0) * scalePool.length);
    index = Math.max(0, Math.min(index, scalePool.length - 1));
    
    dataLog.innerText = `[Timeline: Year ${years}] Telemetry: +${anomaly.toFixed(3)}°C | Freq: ${scalePool[index]} Hz`;
    playSynth(scalePool[index], 'triangle', 0.25);
}

// Space Processing Node (Exoplanet Light Curve Dips & Pulsing Brightness Engine)
function runSpaceLogic(tick, celestialObject) {
    let luminosity = 1.0; 
    let waveType = 'sine'; // Warmer, smoother cosmic frequency pattern
    let statusText = '';

    if (celestialObject.includes("System")) {
        // Exoplanet Light Curve: Steady line that drops dramatically during transit
        const isTransit = (tick % 12 === 0 || tick % 12 === 1);
        if (isTransit) {
            luminosity = 0.65 - (Math.random() * 0.05); // Simulated drop in star brightness
            waveType = 'sawtooth'; // Harsh wave architecture representing an atmospheric eclipse
            statusText = `⚠️ EXOPLANET TRANSIT DETECTED // Light Curve Drop!`;
        } else {
            luminosity = 1.0 + (Math.random() * 0.02 - 0.01);
            statusText = `Clear Star Flux Index: Nominal`;
        }
    } else {
        // Nebulas and Galaxies: Rhythmic, fluctuating cosmic background radiation waves
        luminosity = 0.8 + Math.sin(tick * 0.4) * 0.3 + (Math.random() * 0.05);
        statusText = `Monitoring Cosmic Wavefront Luminosity`;
    }

    // Convert raw luminosity directly to scalePool array boundaries
    let index = Math.floor(luminosity * (scalePool.length / 2) + 3);
    index = Math.max(0, Math.min(index, scalePool.length - 1));
    const frequency = scalePool[index];

    dataLog.innerText = `[Target Index: ${tick}] Relative Flux: ${luminosity.toFixed(4)} L☉\n${statusText} | Freq: ${frequency} Hz`;
    playSynth(frequency, waveType, 0.3);
}

function playSynth(freq, type, duration) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration + 0.05);
}

function togglePlayback() {
    if (isPlaying) {
        stopAudioEngine();
        dataLog.innerText = "Audio stream pipeline paused.";
        document.getElementById('audio-toggle-btn').innerText = "Resume Data Stream";
    } else {
        document.getElementById('audio-toggle-btn').innerText = "Stop Audio Generation";
        if (activeTarget) sonifyTarget(activeTarget);
    }
}

function stopAudioEngine() {
    isPlaying = false;
    if (currentInterval) {
        clearInterval(currentInterval);
        currentInterval = null;
    }
}
