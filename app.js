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

const targetDisplayImg = document.getElementById('target-display-img');
const redDotTracker = document.getElementById('red-dot-tracker');
const overlayLabel = document.getElementById('region-overlay-label');

let audioCtx = null;
let currentInterval = null;
let isPlaying = false;
let activeAlbum = '';
let activeTarget = '';
let animationTick = 0;

const scalePool = [110.00, 130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

// 100% Secure Base64 Inline Graphic Models Database
const albumData = {
    earth: {
        title: "Earth Album Sub-Regions",
        instruction: "Select a geographic continent vector to process 100-year temperature anomalies.",
        emoji: "🌍",
        themeClass: "earth-theme",
        targets: ["North America", "Europe", "Asia", "Africa", "South America"],
        images: {
            "North America": "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='380' height='220'><rect width='100%' height='100%' fill='%2305101a'/><circle cx='190' cy='110' r='80' fill='%231a5fb4'/><path d='M150 70 Q190 50 210 90 T250 130 Z' fill='%232ec27e'/><text x='20' y='40' fill='%23fff' font-family='sans-serif'>NORTH AMERICA SECTOR</text></svg>",
            "Europe": "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='380' height='220'><rect width='100%' height='100%' fill='%2305101a'/><circle cx='190' cy='110' r='80' fill='%231a5fb4'/><path d='M170 80 Q200 60 230 90 T220 140 Z' fill='%232ec27e'/><text x='20' y='40' fill='%23fff' font-family='sans-serif'>EUROPE SECTOR</text></svg>",
            "Asia": "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='380' height='220'><rect width='100%' height='100%' fill='%2305101a'/><circle cx='190' cy='110' r='80' fill='%231a5fb4'/><path d='M180 60 Q240 80 250 120 T190 150 Z' fill='%232ec27e'/><text x='20' y='40' fill='%23fff' font-family='sans-serif'>ASIA SECTOR</text></svg>",
            "Africa": "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='380' height='220'><rect width='100%' height='100%' fill='%2305101a'/><circle cx='190' cy='110' r='80' fill='%231a5fb4'/><path d='M160 90 Q190 130 220 110 T200 160 Z' fill='%232ec27e'/><text x='20' y='40' fill='%23fff' font-family='sans-serif'>AFRICA SECTOR</text></svg>",
            "South America": "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='380' height='220'><rect width='100%' height='100%' fill='%2305101a'/><circle cx='190' cy='110' r='80' fill='%231a5fb4'/><path d='M160 80 Q190 110 180 150 T210 140 Z' fill='%232ec27e'/><text x='20' y='40' fill='%23fff' font-family='sans-serif'>SOUTH AMERICA SECTOR</text></svg>"
        }
    },
    space: {
        title: "Space Album Cosmic Fields",
        instruction: "Select an astronomical asset to monitor real-time luminosity indices and exoplanet orbit light curves.",
        emoji: "🌌",
        themeClass: "space-theme",
        targets: ["Orion Nebula", "Andromeda Galaxy", "Kepler-186 System", "TRAPPIST-1 System"],
        images: {
            "Orion Nebula": "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='380' height='220'><rect width='100%' height='100%' fill='%2302020a'/><radialGradient id='o'><stop offset='0%25' stop-color='%23ff00ff'/><stop offset='60%25' stop-color='%23330066'/><stop offset='100%25' stop-color='transparent'/></radialGradient><circle cx='190' cy='110' r='90' fill='url(%23o)'/><circle cx='160' cy='90' r='3' fill='%23fff'/><circle cx='220' cy='130' r='4' fill='%23fff'/><text x='20' y='40' fill='%23fff' font-family='sans-serif'>ORION NEBULA</text></svg>",
            "Andromeda Galaxy": "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='380' height='220'><rect width='100%' height='100%' fill='%2302020a'/><ellipse cx='190' cy='110' rx='110' ry='40' fill='%23b927fc' opacity='0.6' transform='rotate(-15 190 110)'/><ellipse cx='190' cy='110' rx='40' ry='15' fill='%23ffffff' transform='rotate(-15 190 110)'/><text x='20' y='40' fill='%23fff' font-family='sans-serif'>ANDROMEDA GALAXY (M31)</text></svg>",
            "Kepler-186 System": "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='380' height='220'><rect width='100%' height='100%' fill='%2302020a'/><circle cx='190' cy='110' r='25' fill='%23ffaa00'/><ellipse cx='190' cy='110' rx='120' ry='30' fill='none' stroke='%23333' stroke-width='1'/><text x='20' y='40' fill='%23fff' font-family='sans-serif'>KEPLER-186 SYSTEM</text></svg>",
            "TRAPPIST-1 System": "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='380' height='220'><rect width='100%' height='100%' fill='%2302020a'/><circle cx='190' cy='110' r='20' fill='%23ff3300'/><ellipse cx='190' cy='110' rx='100' ry='25' fill='none' stroke='%23333' stroke-width='1'/><text x='20' y='40' fill='%23fff' font-family='sans-serif'>TRAPPIST-1 SYSTEM</text></svg>"
        }
    }
};

function selectAlbum(albumKey) {
    activeAlbum = albumKey;
    const data = albumData[albumKey];
    selectionScreen.classList.add('hidden');
    workspacePanel.classList.remove('hidden');
    workspacePanel.className = `workspace ${data.themeClass}`;
    workspaceTitle.innerText = data.title;
    workspaceInstruction.innerText = data.instruction;
    idleEmoji.innerText = data.emoji;

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

    statusDisplay.className = 'hidden';
    playbackControls.classList.remove('hidden');
    activeTitle.innerText = `Active Session: ${activeAlbum.toUpperCase()} // Target: ${targetName}`;
    
    targetDisplayImg.src = albumData[activeAlbum].images[targetName];
    
    isPlaying = true;
    animationTick = 0;

    currentInterval = setInterval(() => {
        if (activeAlbum === 'earth') {
            runEarthLogic(animationTick, targetName);
        } else {
            runSpaceLogic(animationTick, targetName);
        }
        animationTick++;
    }, 400);
}

function runEarthLogic(tick, region) {
    const years = 1926 + (tick % 101);
    const customRates = { 'North America': 0.022, 'Europe': 0.028, 'Asia': 0.019, 'Africa': 0.012, 'South America': 0.015 };
    const rate = customRates[region] || 0.015;
    
    const anomaly = (tick % 101) * rate + (Math.random() * 0.12 - 0.06);
    let index = Math.floor(((anomaly + 0.5) / 3.0) * scalePool.length);
    index = Math.max(0, Math.min(index, scalePool.length - 1));
    const frequency = scalePool[index];

    const yPercent = (tick % 101);
    redDotTracker.style.left = "50%"; 
    redDotTracker.style.top = `${yPercent}%`;
    overlayLabel.innerText = `TRACKER FEED: Y-${yPercent}%`;

    dataLog.innerText = `[Timeline: Year ${years}]\nGeospatial Metric: +${anomaly.toFixed(3)}°C Anomaly\nStatus: Tracking surface warming data arrays.\nMapped Output Note: ${frequency} Hz`;
    playSynth(frequency, 'triangle', 0.25);
}

function runSpaceLogic(tick, celestialObject) {
    let luminosity = 1.0; 
    let waveType = 'sine';
    let statusText = '';
    
    let dotX = 50;
    let dotY = 50;

    if (celestialObject.includes("System")) {
        const angle = (tick * 0.2);
        dotX = 50 + Math.cos(angle) * 35;
        dotY = 50 + Math.sin(angle) * 10;

        const isTransit = (dotX > 43 && dotX < 57 && Math.sin(angle) < 0);
        if (isTransit) {
            luminosity = 0.55; 
            waveType = 'sawtooth';
            statusText = `⚠️ TRANSIT DEVIATION: Planet occluding stellar flux matrix profile!`;
        } else {
            luminosity = 1.0;
            statusText = `Telemetry: Stellar luminosity flux index tracking nominal.`;
        }
        overlayLabel.innerText = `TRACKER LOCK: X-${dotX.toFixed(0)}% | Y-${dotY.toFixed(0)}%`;
    } else {
        const waveLoopFactor = 0.8 + Math.sin(tick * 0.4) * 0.3; 
        luminosity = waveLoopFactor;
        statusText = `Spectral Analysis: Tracking multi-band interstellar baseline radiation loops.`;
        
        dotX = 50 + Math.sin(tick * 0.4) * 40;
        dotY = 50;
        overlayLabel.innerText = `TRACKER POSITION: X-${dotX.toFixed(0)}%`;
    }

    let index = Math.floor(luminosity * (scalePool.length / 2) + 3);
    index = Math.max(0, Math.min(index, scalePool.length - 1));
    const frequency = scalePool[index];

    redDotTracker.style.left = `${dotX}%`;
    redDotTracker.style.top = `${dotY}%`;

    dataLog.innerText = `[Sample Quantum Node Index: ${tick}]\nRelative Radiance Flux: ${luminosity.toFixed(4)} L☉\n${statusText}\nMapped Output Note: ${frequency} Hz`;
    playSynth(frequency, waveType, 0.3);
}
function playSynth(freq, type, duration) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const delayNode = audioCtx.createDelay(1.0);
    const feedbackNode = audioCtx.createGain();
    const filterNode = audioCtx.createBiquadFilter();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    delayNode.delayTime.value = 0.28;
    feedbackNode.gain.value = 0.42;
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 1350;
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(filterNode);
    filterNode.connect(audioCtx.destination);
    
    filterNode.connect(delayNode);
    delayNode.connect(feedbackNode);
    feedbackNode.connect(delayNode);
    delayNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration + 0.1);
}

function togglePlayback() {
    if (isPlaying) {
        stopAudioEngine();
        dataLog.innerText = "Audio stream processing chain manually suspended.";
        document.getElementById('audio-toggle-btn').innerText = "Restart Data Stream";
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
