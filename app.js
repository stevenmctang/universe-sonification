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

const canvas = document.getElementById('telemetry-canvas');
const ctx = canvas.getContext('2d');
const overlayLabel = document.getElementById('region-overlay-label');

let audioCtx = null;
let currentInterval = null;
let isPlaying = false;
let activeAlbum = '';
let activeTarget = '';
let animationTick = 0;

const scalePool = [110.00, 130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

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

function draw3DScene(album, target, progress, syncedLuminosity, syncedRadius) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for(let i=0; i<15; i++) {
        let x = (Math.sin(i + target.length) * 0.5 + 0.5) * canvas.width;
        let y = (Math.cos(i * 3) * 0.5 + 0.5) * canvas.height;
        ctx.fillRect(x, y, 2, 2);
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (album === 'earth') {
        let radius = 70;
        let grad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, radius);
        grad.addColorStop(0, '#4facfe');  
        grad.addColorStop(0.7, '#001f3f'); 
        grad.addColorStop(1, '#00020a');   
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.fillStyle = "rgba(72, 187, 120, 0.4)"; 
        ctx.beginPath();
        let rotX = (progress * 3) % radius;
        ctx.arc(cx - radius/2 + rotX, cy - 10, 25, 0, Math.PI*2);
        ctx.arc(cx + radius/3 - rotX, cy + 15, 20, 0, Math.PI*2);
        ctx.fill();

        let laserY = cy - radius + ((progress * 4) % (radius * 2));
        ctx.strokeStyle = "#00f2fe";
        ctx.shadowColor = "#00f2fe";
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - radius - 10, laserY);
        ctx.lineTo(cx + radius + 10, laserY);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(cx, laserY, 4, 0, Math.PI*2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        
        ctx.shadowBlur = 0; 
        overlayLabel.innerText = `LASER SCAN SECTOR: Y-${laserY.toFixed(0)}px`;

    } else if (album === 'space' && target.includes("System")) {
        let radius = 40;
        let grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius + 20);
        grad.addColorStop(0, '#fffdf0');
        grad.addColorStop(0.3, '#ffb900'); 
        grad.addColorStop(0.7, `rgba(255,69,0,${syncedLuminosity * 0.2})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = "rgba(185, 39, 252, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 110, 35, 0, 0, Math.PI * 2);
        ctx.stroke();

        let angle = (progress * 0.15);
        let px = cx + Math.cos(angle) * 110;
        let py = cy + Math.sin(angle) * 35;

        ctx.fillStyle = "#3399ff";
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#b927fc";
        ctx.shadowColor = "#b927fc";
        ctx.shadowBlur = 12;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy); 
        ctx.lineTo(px, py); 
        ctx.stroke();
        ctx.shadowBlur = 0;

        overlayLabel.innerText = `LASER AIM TRACKER: [X:${px.toFixed(0)}px, Y:${py.toFixed(0)}px]`;

    } else {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(progress * 0.03);
        
        let grad = ctx.createRadialGradient(0, 0, 1, 0, 0, 80);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#b927fc'); 
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(0, 242, 254, 0.6)";
        for (let i = 0; i < 40; i++) {
            let armAngle = i * 0.2;
            let dist = i * 2;
            let ax = Math.cos(armAngle) * dist;
            let ay = Math.sin(armAngle) * dist;
            ctx.fillRect(ax, ay, 3, 3);
            ctx.fillRect(-ax, -ay, 3, 3);
        }
        ctx.restore();

        ctx.strokeStyle = "rgba(0, 242, 254, 0.6)";
        ctx.shadowColor = "#00f2fe";
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, syncedRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        overlayLabel.innerText = `RADAR LOCK RADIAL: R-${syncedRadius.toFixed(0)}px`;
    }
}

function runEarthLogic(tick, region) {
    const years = 1926 + (tick % 101);
    const customRates = { 'North America': 0.022, 'Europe': 0.028, 'Asia': 0.019, 'Africa': 0.012, 'South America': 0.015 };
    const rate = customRates[region] || 0.015;
    
    const anomaly = (tick % 101) * rate + (Math.random() * 0.12 - 0.06);
    let index = Math.floor(((anomaly + 0.5) / 3.0) * scalePool.length);
    index = Math.max(0, Math.min(index, scalePool.length - 1));
    
    draw3DScene('earth', region, tick, 1.0, 0);

    dataLog.innerText = `[Timeline: Year ${years}]\nGeospatial Metric: +${anomaly.toFixed(3)}°C Anomaly\nStatus: Tracking surface warming data arrays.\nMapped Output Note: ${scalePool[index]} Hz`;
    playSynth(scalePool[index], 'triangle', 0.25);
}

let staticRadius = 40;

function runSpaceLogic(tick, celestialObject) {
    let luminosity = 1.0; 
    let waveType = 'sine';
    let statusText = '';

    if (celestialObject.includes("System")) {
        let angle = (tick * 0.15);
        let px = (canvas.width / 2) + Math.cos(angle) * 110;
        const isTransit = (px > canvas.width / 2 - 25 && px < canvas.width / 2 + 25 && Math.sin(angle) < 0);
        
        if (isTransit) {
            luminosity = 0.55; 
            waveType = 'sawtooth';
            statusText = `⚠️ TRANSIT DEVIATION: Planet occluding stellar flux matrix profile!`;
        } else {
            luminosity = 1.0;
            statusText = `Telemetry: Stellar luminosity flux index tracking nominal.`;
        }
    } else {
        const waveLoopFactor = 0.8 + Math.sin(tick * 0.4) * 0.3; 
        luminosity = waveLoopFactor;
        statusText = `Spectral Analysis: Tracking multi-band interstellar baseline radiation loops.`;
    }

    let index = Math.floor(luminosity * (scalePool.length / 2) + 3);
    index = Math.max(0, Math.min(index, scalePool.length - 1));
    const frequency = scalePool[index];
    
    // Compute locked alignment coordinates
    staticRadius = 30 + ((luminosity - 0.5) / 0.6) * 70;
    
    draw3DScene('space', celestialObject, tick, luminosity, staticRadius);
    
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
