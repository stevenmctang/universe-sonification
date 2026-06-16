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

// Premium High-Definition Asset Map Database Routing Array
const albumData = {
    earth: {
        title: "Earth Album Sub-Regions",
        instruction: "Select a geographic continent vector to process 100-year temperature anomalies.",
        emoji: "🌍",
        themeClass: "earth-theme",
        targets: ["North America", "Europe", "Asia", "Africa", "South America"],
        images: {
            "North America": "https://unsplash.com",
            "Europe": "https://unsplash.com",
            "Asia": "https://unsplash.com",
            "Africa": "https://unsplash.com",
            "South America": "https://unsplash.com"
        }
    },
    space: {
        title: "Space Album Cosmic Fields",
        instruction: "Select an astronomical asset to monitor real-time luminosity indices and exoplanet orbit light curves.",
        emoji: "🌌",
        themeClass: "space-theme",
        targets: ["Orion Nebula", "Andromeda Galaxy", "Kepler-186 System", "TRAPPIST-1 System"],
        images: {
            "Orion Nebula": "https://unsplash.com",
            "Andromeda Galaxy": "https://unsplash.com",
            "Kepler-186 System": "https://unsplash.com",
            "TRAPPIST-1 System": "https://unsplash.com"
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
    
    // Wire the specific image pathway inside the template viewport
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

    // Single Red Tracker Dot math path: Sweeps clean across the Y-Axis matrix map
    const yPercent = (tick % 101);
    redDotTracker.style.left = "50%"; // Centered horizontally
    redDotTracker.style.top = `${yPercent}%`;
    overlayLabel.innerText = `TRACKER SECTOR FEED: Y-${yPercent}%`;

    dataLog.innerText = `[Timeline: Year ${years}]\nGeospatial Metric: +${anomaly.toFixed(3)}°C Anomaly\nStatus: Tracking surface warming data arrays.\nMapped Output Note: ${frequency} Hz`;
    playSynth(frequency, 'triangle', 0.25);
}

function runSpaceLogic(tick, celestialObject) {
    let luminosity = 1.0; 
    let waveType = 'sine';
    let statusText = '';
    
    // Coordinate vectors for tracker anchoring
    let dotX = 50;
    let dotY = 50;

    if (celestialObject.includes("System")) {
        // Orbit simulation vector mapping coordinates for the dot tracker path
        const angle = (tick * 0.2);
        dotX = 50 + Math.cos(angle) * 35;
        dotY = 50 + Math.sin(angle) * 15;

        // Transit frame calculation checks
        const isTransit = (dotX > 40 && dotX < 60 && Math.sin(angle) < 0);
        if (isTransit) {
            luminosity = 0.55; 
            waveType = 'sawtooth';
            statusText = `⚠️ TRANSIT DEVIATION: Planet occluding stellar flux matrix profile!`;
        } else {
            luminosity = 1.0;
            statusText = `Telemetry: Stellar luminosity flux index tracking nominal.`;
        }
        overlayLabel.innerText = `TRACKER COORDINATE LOCK: X-${dotX.toFixed(0)}% | Y-${dotY.toFixed(0)}%`;
    } else {
        // Waves oscillation algorithm math mapping for Galaxies/Nebulas
        const waveLoopFactor = 0.8 + Math.sin(tick * 0.4) * 0.3; 
        luminosity = waveLoopFactor;
        statusText = `Spectral Analysis: Tracking multi-band interstellar baseline radiation loops.`;
        
        // Single red tracking dot moves fluidly along the sine path to match numbers
        dotX = 50 + Math.sin(tick * 0.4) * 40;
        dotY = 50 + Math.cos(tick * 0.4) * 20;
        overlayLabel.innerText = `TRACKER FREQUENCY VECTOR: X-${dotX.toFixed(0)}%`;
    }

    let index = Math.floor(luminosity * (scalePool.length / 2) + 3);
    index = Math.max(0, Math.min(index, scalePool.length - 1));
    const frequency = scalePool[index];

    // Assign calculated metrics directly onto tracking style arrays
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
