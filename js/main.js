/**
 * main.js - Main game loop and initialization
 */

class GolfGame {
    constructor() {
        this.golfCourse = null;
        this.cameraController = null;
        this.inputHandler = null;
        this.gameState = null;
        this.uiManager = null;
        this.isRunning = false;
        this.animationId = null;
        
        this.init();
    }

    async init() {
        try {
            // Show loading screen
            this.uiManager = new UIManager();
            this.uiManager.showLoadingScreen();

            // Initialize game components
            await this.initializeComponents();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start game loop
            this.start();
            
            // Hide loading screen
            setTimeout(() => {
                this.uiManager.hideLoadingScreen();
                this.showWelcomeMessage();
            }, 1000);
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to load game. Please refresh the page.');
        }
    }

    async initializeComponents() {
        // Initialize golf course (scene, renderer, camera)
        this.golfCourse = new GolfCourse();
        
        // Initialize camera controller
        this.cameraController = new CameraController(
            this.golfCourse.getCamera(),
            this.golfCourse.getRenderer(),
            this.golfCourse.getScene()
        );
        
        // Set ball target for camera
        this.cameraController.setBallTarget(this.golfCourse.getBall());
        
        // Initialize game state
        this.gameState = new GameState();
        
        // Initialize input handler
        this.inputHandler = new InputHandler(this.golfCourse, this.gameState);
        
        // Set initial camera position for hole 1
        this.cameraController.setHoleOverview(
            this.golfCourse.getCurrentHoleData().holePosition,
            this.gameState.currentHole
        );
    }

    setupEventListeners() {
        // Handle window events
        window.addEventListener('gameResize', () => {
            this.handleResize();
        });

        window.addEventListener('gamePause', () => {
            this.pause();
        });

        window.addEventListener('gameResume', () => {
            this.resume();
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Handle beforeunload (page refresh/close)
        window.addEventListener('beforeunload', (e) => {
            if (this.gameState.getCurrentStrokes() > 0) {
                e.preventDefault();
                e.returnValue = 'You have a game in progress. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    resume() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.gameLoop();
        }
    }

    gameLoop() {
        if (!this.isRunning) return;

        // Update physics
        const physicsResult = this.golfCourse.updatePhysics();
        
        // Handle physics results
        this.handlePhysicsResult(physicsResult);
        
        // Update camera
        this.cameraController.update();
        
        // Update ball movement state in input handler
        this.inputHandler.onBallMovementChange(this.golfCourse.isBallMoving());
        
        // Render scene
        this.golfCourse.getRenderer().render(
            this.golfCourse.getScene(),
            this.golfCourse.getCamera()
        );
        
        // Continue game loop
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    handlePhysicsResult(result) {
        switch (result) {
            case 'out_of_bounds':
                this.inputHandler.onOutOfBounds();
                break;
                
            case 'hole_complete':
                this.handleHoleComplete();
                break;
                
            case 'moving':
                // Ball is still moving, no action needed
                break;
                
            default:
                // Ball stopped or no result
                break;
        }
    }

    handleHoleComplete() {
        // Celebrate hole completion
        this.uiManager.showMessage('Hole Complete!', 2000, 'success');
        
        // Show completion modal
        this.inputHandler.onHoleComplete();
        
        // Check if this was the last hole
        if (this.gameState.isLastHole()) {
            this.handleGameComplete();
        }
    }

    handleGameComplete() {
        // Game is complete
        this.uiManager.showMessage('Congratulations! You completed the course!', 5000, 'success');
        
        // Could add high score saving, statistics, etc. here
        this.saveGameStats();
    }

    saveGameStats() {
        const stats = {
            totalStrokes: this.gameState.getTotalScore(),
            holeScores: this.gameState.strokesPerHole,
            completionTime: Date.now(),
            scoreToPar: this.gameState.getScoreRelativeToPar()
        };
        
        // Save to localStorage for now (could be extended to use a database)
        try {
            const existingStats = JSON.parse(localStorage.getItem('golfGameStats') || '[]');
            existingStats.push(stats);
            localStorage.setItem('golfGameStats', JSON.stringify(existingStats));
        } catch (error) {
            console.warn('Could not save game statistics:', error);
        }
    }

    nextHole() {
        const success = this.gameState.nextHole();
        
        if (success) {
            // Load next hole
            this.golfCourse.loadHole(this.gameState.currentHole - 1);
            
            // Reset input controls
            this.inputHandler.resetControls();
            
            // Set camera for new hole
            this.cameraController.setHoleOverview(
                this.golfCourse.getCurrentHoleData().holePosition,
                this.gameState.currentHole
            );
            
            // Show hole info
            const holeData = this.golfCourse.getCurrentHoleData();
            this.uiManager.showMessage(
                `Hole ${this.gameState.currentHole} - Par ${holeData.par}`,
                3000,
                'info'
            );
        }
        
        return success;
    }

    restartHole() {
        // Reset game state for current hole
        this.gameState.restartHole();
        
        // Reset ball position
        this.golfCourse.resetBallToStart();
        
        // Reset input controls
        this.inputHandler.resetControls();
        
        // Reset camera
        this.cameraController.setHoleOverview(
            this.golfCourse.getCurrentHoleData().holePosition,
            this.gameState.currentHole
        );
        
        this.uiManager.showMessage('Hole restarted', 2000, 'info');
    }

    restartGame() {
        // Reset everything
        this.gameState.restartGame();
        this.golfCourse.loadHole(0);
        this.inputHandler.resetControls();
        this.cameraController.setHoleOverview(
            this.golfCourse.getCurrentHoleData().holePosition,
            1
        );
        
        this.uiManager.showMessage('Game restarted', 2000, 'info');
    }

    handleResize() {
        // Camera controller handles the actual resize
        // This is just for any additional UI adjustments
        console.log('Game resized');
    }

    showWelcomeMessage() {
        this.uiManager.showMessage(
            'Welcome to 3D Golf! Use the controls to aim and shoot the ball into the hole.',
            5000,
            'info'
        );
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            text-align: center;
            font-family: Arial, sans-serif;
        `;
        errorDiv.innerHTML = `
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #ff4444;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            ">Reload Page</button>
        `;
        document.body.appendChild(errorDiv);
    }

    // Public methods for external access
    getCurrentGameState() {
        return {
            hole: this.gameState.currentHole,
            strokes: this.gameState.getCurrentStrokes(),
            totalScore: this.gameState.getTotalScore(),
            isComplete: this.gameState.gameComplete,
            ballPosition: this.golfCourse.getBallPosition(),
            isBallMoving: this.golfCourse.isBallMoving()
        };
    }

    // Debug methods
    enableDebugMode() {
        window.golfGame = this;
        window.golfCourse = this.golfCourse;
        window.gameState = this.gameState;
        window.cameraController = this.cameraController;
        
        console.log('Debug mode enabled. Access game objects via window.golfGame');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check for WebGL support
    if (!window.WebGLRenderingContext) {
        alert('Your browser does not support WebGL. Please use a modern browser to play this game.');
        return;
    }

    // Check for Three.js
    if (typeof THREE === 'undefined') {
        alert('Three.js library failed to load. Please check your internet connection and refresh the page.');
        return;
    }

    // Initialize the game
    const game = new GolfGame();
    
    // Enable debug mode in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        game.enableDebugMode();
    }
    
    // Make game globally accessible
    window.golfGameInstance = game;
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.golfGameInstance) {
        window.golfGameInstance.pause();
    }
});
