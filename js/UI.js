/**
 * UI.js - Manages the user interface and game state display
 */

class GameState {
    constructor() {
        this.currentHole = 1;
        this.totalHoles = 2;
        this.strokesPerHole = [0, 0]; // Strokes for each hole
        this.parPerHole = [3, 4]; // Par for each hole
        this.totalScore = 0;
        this.gameComplete = false;
        
        this.updateUI();
    }

    incrementStrokes() {
        this.strokesPerHole[this.currentHole - 1]++;
        this.updateUI();
    }

    addPenaltyStroke() {
        this.strokesPerHole[this.currentHole - 1]++;
        this.updateUI();
    }

    getCurrentStrokes() {
        return this.strokesPerHole[this.currentHole - 1];
    }

    getCurrentPar() {
        return this.parPerHole[this.currentHole - 1];
    }

    getTotalScore() {
        return this.strokesPerHole.reduce((total, strokes) => total + strokes, 0);
    }

    getScoreRelativeToPar() {
        let totalPar = 0;
        let totalStrokes = 0;
        
        for (let i = 0; i < this.currentHole; i++) {
            totalPar += this.parPerHole[i];
            totalStrokes += this.strokesPerHole[i];
        }
        
        return totalStrokes - totalPar;
    }

    nextHole() {
        if (this.currentHole < this.totalHoles) {
            this.currentHole++;
            this.updateUI();
            return true;
        } else {
            this.gameComplete = true;
            this.showGameComplete();
            return false;
        }
    }

    restartHole() {
        this.strokesPerHole[this.currentHole - 1] = 0;
        this.updateUI();
    }

    restartGame() {
        this.currentHole = 1;
        this.strokesPerHole = [0, 0];
        this.totalScore = 0;
        this.gameComplete = false;
        this.updateUI();
    }

    isLastHole() {
        return this.currentHole === this.totalHoles;
    }

    updateUI() {
        // Update hole number
        const holeElement = document.getElementById('current-hole');
        if (holeElement) {
            holeElement.textContent = this.currentHole;
        }

        // Update par
        const parElement = document.getElementById('current-par');
        if (parElement) {
            parElement.textContent = this.getCurrentPar();
        }

        // Update stroke count
        const strokeElement = document.getElementById('stroke-count');
        if (strokeElement) {
            strokeElement.textContent = this.getCurrentStrokes();
        }

        // Update total score
        const totalElement = document.getElementById('total-score');
        if (totalElement) {
            const total = this.getTotalScore();
            const relativeToPar = this.getScoreRelativeToPar();
            
            let scoreText = total.toString();
            if (relativeToPar > 0) {
                scoreText += ` (+${relativeToPar})`;
            } else if (relativeToPar < 0) {
                scoreText += ` (${relativeToPar})`;
            } else if (this.currentHole > 1) {
                scoreText += ' (E)';
            }
            
            totalElement.textContent = scoreText;
        }
    }

    showGameComplete() {
        const totalStrokes = this.getTotalScore();
        const totalPar = this.parPerHole.reduce((sum, par) => sum + par, 0);
        const scoreDifference = totalStrokes - totalPar;
        
        let message = `Game Complete!\n\nFinal Score: ${totalStrokes}`;
        
        if (scoreDifference < 0) {
            message += ` (${scoreDifference} under par!)`;
        } else if (scoreDifference > 0) {
            message += ` (+${scoreDifference} over par)`;
        } else {
            message += ` (Even par!)`;
        }
        
        message += `\n\nHole 1: ${this.strokesPerHole[0]} strokes (Par ${this.parPerHole[0]})`;
        message += `\nHole 2: ${this.strokesPerHole[1]} strokes (Par ${this.parPerHole[1]})`;
        
        alert(message);
    }
}

class UIManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.gameContainer = document.getElementById('game-container');
        this.messageQueue = [];
        this.isShowingMessage = false;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
            this.loadingScreen.style.opacity = '1';
        }
    }

    handleResize() {
        // This will be handled by the camera controller
        // Just trigger a custom event that other components can listen to
        window.dispatchEvent(new CustomEvent('gameResize'));
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Game is hidden, pause if needed
            window.dispatchEvent(new CustomEvent('gamePause'));
        } else {
            // Game is visible, resume if needed
            window.dispatchEvent(new CustomEvent('gameResume'));
        }
    }

    showMessage(text, duration = 3000, type = 'info') {
        const message = { text, duration, type, timestamp: Date.now() };
        this.messageQueue.push(message);
        
        if (!this.isShowingMessage) {
            this.processMessageQueue();
        }
    }

    processMessageQueue() {
        if (this.messageQueue.length === 0) {
            this.isShowingMessage = false;
            return;
        }

        this.isShowingMessage = true;
        const message = this.messageQueue.shift();
        
        const messageDisplay = document.getElementById('message-display');
        if (messageDisplay) {
            messageDisplay.textContent = message.text;
            messageDisplay.className = `message-${message.type}`;
            messageDisplay.style.display = 'block';
            
            setTimeout(() => {
                messageDisplay.style.display = 'none';
                this.processMessageQueue();
            }, message.duration);
        } else {
            this.processMessageQueue();
        }
    }

    updateGameInfo(holeNumber, par, strokes, totalScore) {
        const elements = {
            'current-hole': holeNumber,
            'current-par': par,
            'stroke-count': strokes,
            'total-score': totalScore
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    setControlsEnabled(enabled) {
        const controls = [
            'aim-direction',
            'shot-power',
            'shoot-button',
            'reset-camera',
            'follow-ball'
        ];

        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.disabled = !enabled;
            }
        });
    }

    highlightElement(elementId, duration = 2000) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('highlight');
            setTimeout(() => {
                element.classList.remove('highlight');
            }, duration);
        }
    }

    createNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <strong>${title}</strong>
                <button class="notification-close">&times;</button>
            </div>
            <div class="notification-body">${message}</div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Handle close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        return notification;
    }

    updateProgressBar(current, total, elementId) {
        const progressBar = document.getElementById(elementId);
        if (progressBar) {
            const percentage = (current / total) * 100;
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', current);
            progressBar.setAttribute('aria-valuemax', total);
        }
    }

    animateScore(elementId, newValue, duration = 1000) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = parseInt(element.textContent) || 0;
        const difference = newValue - startValue;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const eased = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;

            const currentValue = Math.round(startValue + (difference * eased));
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    showTooltip(elementId, text, position = 'top') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const tooltip = document.createElement('div');
        tooltip.className = `tooltip tooltip-${position}`;
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        if (position === 'bottom') {
            top = rect.bottom + 10;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.opacity = '1';
        
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        }, 3000);
    }

    // Utility methods for common UI operations
    fadeIn(elementId, duration = 300) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;
                
                element.style.opacity = Math.min(progress, 1);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }
    }

    fadeOut(elementId, duration = 300) {
        const element = document.getElementById(elementId);
        if (element) {
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;
                
                element.style.opacity = 1 - Math.min(progress, 1);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
}
