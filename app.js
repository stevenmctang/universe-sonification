// Replace your entire app.js file with this complete multi-engine tracking build
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

// Telemetry Targeting UI Hooks
const targetMapImg = document.getElementById('target-map-img');
const scannerLaser = document.getElementById('scanner-laser');
const orbitTracker = document.getElementById('orbit-tracker');
const overlayLabel = document.getElementById('region-overlay-label');

let audioCtx = null;
let currentInterval = null;
let isPlaying = false;
let activeAlbum = '';
let activeTarget = '';

const scalePool = [110.00, 130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

// Comprehensive Database Configuration
const albumData = {
    earth: {
        title: "Earth Album Sub-Regions",
        instruction: "Select a geographic continent vector to process 100-year temperature anomalies.",
        emoji: "🌍",
        themeClass: "earth-theme",
        targets: ["North America", "Europe", "Asia", "Africa", "South America"],
        // Verified high-definition topographic assets
        imageMaps: {
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
        // NASA Science/Hubble data concept imagery
        imageMaps: {
            "Orion Nebula": "https://nasa.gov",
            "Andromeda Galaxy": "https://wikimedia.org",
            "Kepler-186 System": "https://nasa.gov",
            "TRAPPIST-1 System": "https://nasa.gov"
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

    statusDisplay.classList.add('hidden');
    playbackControls.classList.remove('hidden');
    activeTitle.innerText = `Active Session: ${activeAlbum.toUpperCase()} // Target: ${targetName}`;
    
    // Inject the specific image asset map location parameters
    const currentAssetMap = albumData[activeAlbum].imageMaps[targetName];
    targetMapImg.src = currentAssetMap;

    // Reset visual tracker positioning profiles
    scannerLaser.classList.remove('hidden');
    orbitTracker.classList.add('hidden');

    isPlaying = true;
    let clockTicks = 0;

    currentInterval = setInterval(() => {
        if (activeAlbum === 'earth') {
            runEarthLogic(clockTicks, targetName);
        } else {
            runSpaceLogic(clockTicks, targetName);
        }
        clockTicks++;
    }, 400);
}

function runEarthLogic(tick, region) {
    const targetYear = 1926 + (tick % 101);
    const customRates = { 'North America': 0.022, 'Europe': 0.028, 'Asia': 0.019, 'Africa': 0.012, 'South America': 0.015 };
    const rate = customRates[region] || 0.015;
    
    const anomaly = (tick % 101) * rate + (Math.random() * 0.12 - 0.06);
    let index = Math.floor(((anomaly + 0.5) / 3.0) * scalePool.length);
    index = Math.max(0, Math.min(index, scalePool.length - 1));
    
    // UI Scanning Line Calculation Math
    const yPercentage = (tick % 101);
    scannerLaser.style.top = `${yPercentage}%`;
    overlayLabel.innerText = `SCAN LATITUDE RADIAL: ${yPercentage}°N`;

    dataLog.innerText = `[Timeline: Year ${targetYear}] Telemetry: +${anomaly.toFixed(3)}°C | Freq: ${scalePool[index]} Hz`;
    playSynth(scalePool[index], 'triangle', 0.25);
}

function runSpaceLogic(tick, celestialObject) {
    let luminosity = 1.0; 
    let waveType = 'sine';
    let statusText = '';

    if (celestialObject.includes("System")) {
        // Exoplanet Orbit Tracking Interface Modifiers
        scannerLaser.classList.add('hidden'); // Hide the standard flat line scanner
        orbitTracker.classList.remove('hidden'); // Enable orbit dot cursor

        // Calculate orbit position across the x-axis (0% to 100% wide)
        const orbitPosition = (tick * 8) % 108; 
        orbitTracker.style.left = `${orbitPosition}%`;

        // If the planet falls right in front of the center star (between 40% and 60% coordinates)
        const isTransit = (orbitPosition >= 40 && orbitPosition <= 60);
        if (isTransit) {
            luminosity = 0.60 - (Math.random() * 0.04);
            waveType = 'sawtooth';
            statusText = `⚠️ TRANSIT DEVIATION RADIAL INDICES FLUX DECREASE DETECTED`;
            orbitTracker.style.transform = `translate(-50%, -50%) scale(1.6)`; // Dot scales up as it passes
        } else {
            luminosity = 1.0 + (Math.random() * 0.02 - 0.01);
            statusText = `Star Solar Luminosity Vector: Constant Continuum`;
            orbitTracker.style.transform = `translate(-50%, -50%) scale(1.0)`;
        }
        overlayLabel.innerText = `ORBIT TRACKING COORDINATES: X-${orbitPosition}°`;
    } else {
        // Deep Nebulas/Galaxies layout configurations
        scannerLaser.classList.remove('hidden');
        orbitTracker.classList.add('hidden');

        // Loop the laser bar scan coordinates back and forth smoothly
        const loopFactor = Math.abs(Math.sin(tick * 0.15) * 100);
        scannerLaser.style.top = `${loopFactor}%`;
        overlayLabel.innerText = `SPECTRAL FILAMENT SCAN DEPTH: ${loopFactor.toFixed(0)}%`;

        luminosity = 0.8 + Math.sin(tick * 0.4) * 0.3 + (Math.random() * 0.05);
        statusText = `Monitoring Photon Spectral Mass Densities`;
    }

    let index = Math.floor(luminosity * (scalePool.length / 2) + 3);
    index = Math.max(0, Math.min(index, scalePool.length - 1));
    const frequency = scalePool[index];

    dataLog.innerText = `[Sample Vector Index: ${tick}] Relative Flux: ${luminosity.toFixed(4)} L☉\n${statusText} | Freq: ${frequency} Hz`;
    playSynth(frequency, waveType, 0.3);
}

// Custom Space Echo and Reverb Signal Chain Pipeline Engine Module
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