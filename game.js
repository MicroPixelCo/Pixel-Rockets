// ============================================
// Game Class - Main Game Logic
// ============================================

let game;

class Game {
    constructor() {
        this.rocket = new Rocket();
        this.physics = new PhysicsEngine();
        this.canvas = document.getElementById('rocketCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.flightCanvas = document.getElementById('flightCanvas');
        this.flightCtx = this.flightCanvas.getContext('2d');
        this.lastTime = Date.now();
        this.thrustDuration = 5000;
        this.thrustStartTime = 0;
        this.animationId = null;
        this.isRunning = false;
        this.selectedPart = null;
        this.gameState = 'menu';
    }

    startGame() {
        this.gameState = 'building';
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
        this.drawBuilder();
    }

    launch() {
        if (this.rocket.state === 'building') {
            if (this.rocket.canLaunch()) {
                this.rocket.launch();
                this.thrustStartTime = Date.now();
                document.getElementById('gameScreen').classList.remove('active');
                document.getElementById('flightScreen').classList.add('active');
                this.gameState = 'flying';
                this.startFlightLoop();
            } else {
                alert('Cannot launch!\n\n- Must have Capsule\n- Must have Engine\n- Thrust/Weight ratio must be > 1.0');
            }
        }
    }

    landRocket() {
        this.rocket.isFlying = false;
        this.gameState = 'building';
        document.getElementById('flightScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
    }

    clearRocket() {
        if (confirm('Clear all parts?')) {
            this.rocket.clear();
            this.updateStats();
            this.drawBuilder();
        }
    }

    addPart(type) {
        if (this.rocket.addPart(createPart(type))) {
            this.updateStats();
            this.drawBuilder();
        }
    }

    removePartByIndex(index) {
        if (this.rocket.removePart(index)) {
            this.updateStats();
            this.drawBuilder();
        }
    }

    updateStats() {
        const mass = this.rocket.getTotalMass();
        const thrust = this.rocket.getTotalThrust();
        const cost = this.rocket.getTotalCost();
        const twRatio = this.rocket.getThrustToWeightRatio();

        document.getElementById('totalMass').textContent = `${mass} kg`;
        document.getElementById('totalThrust').textContent = `${thrust} N`;
        document.getElementById('totalCost').textContent = `$${cost}`;
        document.getElementById('twRatio').textContent = twRatio;

        // Update installed parts list
        const list = document.getElementById('installedPartsList');
        if (this.rocket.parts.length === 0) {
            list.innerHTML = '<p class="empty-text">No parts installed</p>';
        } else {
            list.innerHTML = this.rocket.parts.map((part, index) => `
                <div class="installed-item">
                    <span>${part.icon} ${part.name}</span>
                    <button class="remove-btn" onclick="game.removePartByIndex(${index})">✕</button>
                </div>
            `).join('');
        }

        // Update launch button
        const launchBtn = document.querySelector('.launch-btn');
        if (this.rocket.canLaunch()) {
            launchBtn.disabled = false;
        } else {
            launchBtn.disabled = true;
        }
    }

    drawBuilder() {
        const canvas = document.getElementById('rocketCanvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'transparent';
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw rocket parts
        let y = canvas.height - 80;
        for (let i = 0; i < this.rocket.parts.length; i++) {
            const part = this.rocket.parts[i];
            this.drawPart(ctx, canvas.width / 2, y, part, i);
            y -= 40;
        }
    }

    drawPart(ctx, x, y, part, index) {
        // Draw part box
        ctx.fillStyle = part.color;
        ctx.fillRect(x - 40, y - 20, 80, 40);

        // Draw border
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 40, y - 20, 80, 40);

        // Draw icon
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.fillText(part.icon, x, y);
    }

    startFlightLoop() {
        this.isRunning = true;
        this.lastTime = Date.now();
        this.flightLoop();
    }

    flightLoop = () => {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (currentTime - this.thrustStartTime > this.thrustDuration) {
            this.rocket.isThrusting = false;
        }

        this.physics.update(this.rocket, deltaTime);
        this.updateTelemetry();
        this.drawFlight();

        if (this.rocket.isFlying) {
            this.animationId = requestAnimationFrame(this.flightLoop);
        } else {
            this.isRunning = false;
        }
    }

    updateTelemetry() {
        document.getElementById('altitude').textContent = Math.round(this.rocket.altitude) + ' m';
        document.getElementById('velocity').textContent = this.rocket.velocity.magnitude().toFixed(1) + ' m/s';
        document.getElementById('maxAltitude').textContent = Math.round(this.rocket.maxAltitude) + ' m';
        document.getElementById('fuel').textContent = Math.round(this.rocket.fuelRemaining) + '%';
    }

    drawFlight() {
        const w = this.flightCanvas.width;
        const h = this.flightCanvas.height;

        // Clear canvas
        const gradient = this.flightCtx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#000033');
        gradient.addColorStop(1, '#003366');
        this.flightCtx.fillStyle = gradient;
        this.flightCtx.fillRect(0, 0, w, h);

        // Draw ground
        this.flightCtx.fillStyle = '#8B7355';
        this.flightCtx.fillRect(0, h - 100, w, 100);

        this.flightCtx.fillStyle = '#2D5016';
        this.flightCtx.fillRect(0, h - 100, w, 5);

        // Draw rocket
        const screenY = h - (this.rocket.position.y / 50);
        this.drawRocketFlying(w / 2, Math.max(20, Math.min(h - 120, screenY)));
    }

    drawRocketFlying(x, y) {
        const rocketHeight = 50;
        const rocketWidth = 25;

        // Body
        this.flightCtx.fillStyle = '#FFE66D';
        this.flightCtx.fillRect(x - rocketWidth / 2, y - rocketHeight / 2, rocketWidth, rocketHeight);

        // Tip
        this.flightCtx.fillStyle = '#FF6B6B';
        this.flightCtx.beginPath();
        this.flightCtx.moveTo(x, y - rocketHeight / 2 - 15);
        this.flightCtx.lineTo(x - rocketWidth / 2, y - rocketHeight / 2);
        this.flightCtx.lineTo(x + rocketWidth / 2, y - rocketHeight / 2);
        this.flightCtx.fill();

        // Flame
        if (this.rocket.isThrusting && this.rocket.fuelRemaining > 0) {
            const flameLength = 20 + Math.random() * 15;
            this.flightCtx.fillStyle = '#FF4500';
            this.flightCtx.beginPath();
            this.flightCtx.moveTo(x - rocketWidth / 3, y + rocketHeight / 2);
            this.flightCtx.lineTo(x, y + rocketHeight / 2 + flameLength);
            this.flightCtx.lineTo(x + rocketWidth / 3, y + rocketHeight / 2);
            this.flightCtx.fill();

            this.flightCtx.fillStyle = '#FFD700';
            this.flightCtx.beginPath();
            this.flightCtx.moveTo(x - rocketWidth / 4, y + rocketHeight / 2);
            this.flightCtx.lineTo(x, y + rocketHeight / 2 + flameLength * 0.6);
            this.flightCtx.lineTo(x + rocketWidth / 4, y + rocketHeight / 2);
            this.flightCtx.fill();
        }

        // Parachute
        if (this.rocket.parachuteDeployed) {
            this.flightCtx.strokeStyle = '#95E1D3';
            this.flightCtx.lineWidth = 3;
            this.flightCtx.beginPath();
            this.flightCtx.arc(x, y - 60, 35, Math.PI, 0, false);
            this.flightCtx.stroke();
        }
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
