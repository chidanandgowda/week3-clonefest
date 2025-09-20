/**
 * InputHandler.js - Handles user input for aiming, power control, and shooting
 */

class InputHandler {
    constructor(golfCourse, gameState) {
        this.golfCourse = golfCourse;
        this.gameState = gameState;
        this.currentDirection = 0;
        this.currentPower = 50;
        this.isAiming = false;
        
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Direction control
        const directionSlider = document.getElementById('aim-direction');
        const directionValue = document.getElementById('aim-value');
        
        if (directionSlider && directionValue) {
            directionSlider.addEventListener('input', (e) => {
                this.currentDirection = parseInt(e.target.value);
                directionValue.textContent = `${this.currentDirection}°`;
                this.updateAiming();
            });

            directionSlider.addEventListener('mousedown', () => {
                this.isAiming = true;
                this.updateAiming();
            });

            directionSlider.addEventListener('mouseup', () => {
                this.isAiming = false;
            });
        }

        // Power control
        const powerSlider = document.getElementById('shot-power');
        const powerValue = document.getElementById('power-value');
        
        if (powerSlider && powerValue) {
            powerSlider.addEventListener('input', (e) => {
                this.currentPower = parseInt(e.target.value);
                powerValue.textContent = `${this.currentPower}%`;
                this.updateAiming();
            });
        }

        // Shoot button
        const shootButton = document.getElementById('shoot-button');
        if (shootButton) {
            shootButton.addEventListener('click', () => {
                this.shoot();
            });
        }

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        // Instructions toggle
        const instructionsToggle = document.getElementById('instructions-toggle');
        const instructionsContent = document.getElementById('instructions-content');
        
        if (instructionsToggle && instructionsContent) {
            instructionsToggle.addEventListener('click', () => {
                const isHidden = instructionsContent.classList.contains('hidden');
                instructionsContent.classList.toggle('hidden');
                instructionsToggle.textContent = isHidden ? 'Instructions ▲' : 'Instructions ▼';
            });
        }

        // Modal buttons
        const nextLevelBtn = document.getElementById('next-level-btn');
        const restartLevelBtn = document.getElementById('restart-level-btn');
        
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                this.gameState.nextHole();
                this.hideModal();
            });
        }

        if (restartLevelBtn) {
            restartLevelBtn.addEventListener('click', () => {
                this.gameState.restartHole();
                this.hideModal();
            });
        }
    }

    handleKeyDown(e) {
        if (this.golfCourse.isBallMoving()) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.adjustDirection(-5);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.adjustDirection(5);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.adjustPower(5);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.adjustPower(-5);
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                this.shoot();
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                this.gameState.restartHole();
                break;
        }
    }

    adjustDirection(delta) {
        this.currentDirection = (this.currentDirection + delta + 360) % 360;
        this.updateDirectionUI();
        this.updateAiming();
    }

    adjustPower(delta) {
        this.currentPower = Math.max(0, Math.min(100, this.currentPower + delta));
        this.updatePowerUI();
        this.updateAiming();
    }

    updateDirectionUI() {
        const directionSlider = document.getElementById('aim-direction');
        const directionValue = document.getElementById('aim-value');
        
        if (directionSlider) directionSlider.value = this.currentDirection;
        if (directionValue) directionValue.textContent = `${this.currentDirection}°`;
    }

    updatePowerUI() {
        const powerSlider = document.getElementById('shot-power');
        const powerValue = document.getElementById('power-value');
        
        if (powerSlider) powerSlider.value = this.currentPower;
        if (powerValue) powerValue.textContent = `${this.currentPower}%`;
    }

    updateAiming() {
        if (!this.golfCourse.isBallMoving()) {
            this.golfCourse.updateAimingHelpers(this.currentDirection, this.currentPower);
        }
    }

    shoot() {
        if (this.golfCourse.isBallMoving()) {
            this.showMessage('Wait for the ball to stop moving!');
            return;
        }

        const success = this.golfCourse.shootBall(this.currentDirection, this.currentPower);
        
        if (success) {
            this.gameState.incrementStrokes();
            this.updateShootButton(false);
            this.showMessage(`Shot fired! Direction: ${this.currentDirection}°, Power: ${this.currentPower}%`);
        }
    }

    updateShootButton(enabled) {
        const shootButton = document.getElementById('shoot-button');
        if (shootButton) {
            shootButton.disabled = !enabled;
            shootButton.textContent = enabled ? 'Shoot!' : 'Ball Moving...';
        }
    }

    updateUI() {
        this.updateDirectionUI();
        this.updatePowerUI();
        this.updateShootButton(!this.golfCourse.isBallMoving());
    }

    showMessage(text, duration = 3000) {
        const messageDisplay = document.getElementById('message-display');
        if (messageDisplay) {
            messageDisplay.textContent = text;
            messageDisplay.style.display = 'block';
            
            setTimeout(() => {
                messageDisplay.style.display = 'none';
            }, duration);
        }
    }

    showHoleCompleteModal(strokes, par, isLastHole = false) {
        const modal = document.getElementById('level-complete-modal');
        const finalStrokes = document.getElementById('final-strokes');
        const finalPar = document.getElementById('final-par');
        const scoreMessage = document.getElementById('score-message');
        const nextLevelBtn = document.getElementById('next-level-btn');
        
        if (modal && finalStrokes && finalPar && scoreMessage) {
            finalStrokes.textContent = strokes;
            finalPar.textContent = par;
            
            // Determine score message
            let message = '';
            let messageClass = '';
            
            if (strokes === 1) {
                message = 'Hole in One! Amazing!';
                messageClass = 'excellent';
            } else if (strokes <= par - 2) {
                message = 'Eagle! Outstanding!';
                messageClass = 'excellent';
            } else if (strokes === par - 1) {
                message = 'Birdie! Great shot!';
                messageClass = 'good';
            } else if (strokes === par) {
                message = 'Par! Nice work!';
                messageClass = 'par';
            } else if (strokes === par + 1) {
                message = 'Bogey. Keep trying!';
                messageClass = 'bogey';
            } else {
                message = 'Over par. Practice makes perfect!';
                messageClass = 'over-par';
            }
            
            scoreMessage.textContent = message;
            scoreMessage.className = messageClass;
            
            // Show/hide next level button
            if (nextLevelBtn) {
                if (isLastHole) {
                    nextLevelBtn.textContent = 'Game Complete!';
                    nextLevelBtn.disabled = true;
                } else {
                    nextLevelBtn.textContent = 'Next Hole';
                    nextLevelBtn.disabled = false;
                }
            }
            
            modal.classList.remove('hidden');
        }
    }

    hideModal() {
        const modal = document.getElementById('level-complete-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Enable/disable controls based on game state
    setControlsEnabled(enabled) {
        const directionSlider = document.getElementById('aim-direction');
        const powerSlider = document.getElementById('shot-power');
        const shootButton = document.getElementById('shoot-button');
        
        if (directionSlider) directionSlider.disabled = !enabled;
        if (powerSlider) powerSlider.disabled = !enabled;
        if (shootButton) shootButton.disabled = !enabled;
    }

    // Reset controls to default values
    resetControls() {
        this.currentDirection = 0;
        this.currentPower = 50;
        this.updateUI();
        this.updateAiming();
    }

    // Get current aim settings
    getAimSettings() {
        return {
            direction: this.currentDirection,
            power: this.currentPower
        };
    }

    // Set aim settings
    setAimSettings(direction, power) {
        this.currentDirection = direction;
        this.currentPower = power;
        this.updateUI();
        this.updateAiming();
    }

    // Handle ball movement state changes
    onBallMovementChange(isMoving) {
        this.updateShootButton(!isMoving);
        this.setControlsEnabled(!isMoving);
        
        if (!isMoving) {
            this.updateAiming();
        }
    }

    // Handle out of bounds
    onOutOfBounds() {
        this.showMessage('Ball went out of bounds! Returning to start position.', 4000);
        this.gameState.addPenaltyStroke();
    }

    // Handle hole completion
    onHoleComplete() {
        const holeData = this.golfCourse.getCurrentHoleData();
        const strokes = this.gameState.getCurrentStrokes();
        const isLastHole = this.gameState.isLastHole();
        
        this.showHoleCompleteModal(strokes, holeData.par, isLastHole);
    }
}
