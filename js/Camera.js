/**
 * Camera.js - Handles camera controls and positioning for the 3D golf game
 */

class CameraController {
    constructor(camera, renderer, scene) {
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
        this.controls = null;
        this.followingBall = false;
        this.ballTarget = null;
        
        this.initializeControls();
        this.setupEventListeners();
    }

    initializeControls() {
        // Initialize OrbitControls for interactive camera movement
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        
        // Configure control settings
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        
        // Set distance limits
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        
        // Set vertical angle limits
        this.controls.maxPolarAngle = Math.PI / 2.1; // Prevent going below ground
        this.controls.minPolarAngle = Math.PI / 6;   // Prevent going too high
        
        // Set initial position
        this.setDefaultPosition();
    }

    setDefaultPosition() {
        // Position camera for good overview of the course
        this.camera.position.set(0, 15, 20);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.followingBall = false;
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Camera control buttons
        const resetButton = document.getElementById('reset-camera');
        const followButton = document.getElementById('follow-ball');

        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetView();
            });
        }

        if (followButton) {
            followButton.addEventListener('click', () => {
                this.toggleFollowBall();
            });
        }
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Update camera aspect ratio
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        // Update renderer size
        this.renderer.setSize(width, height);
    }

    resetView() {
        this.setDefaultPosition();
        this.showMessage('Camera reset to default view');
    }

    toggleFollowBall() {
        this.followingBall = !this.followingBall;
        const followButton = document.getElementById('follow-ball');
        
        if (this.followingBall) {
            followButton.textContent = 'Stop Following';
            this.showMessage('Camera following ball');
        } else {
            followButton.textContent = 'Follow Ball';
            this.showMessage('Camera stopped following ball');
        }
    }

    setBallTarget(ballMesh) {
        this.ballTarget = ballMesh;
    }

    update() {
        if (this.followingBall && this.ballTarget) {
            // Smoothly follow the ball
            const ballPosition = this.ballTarget.position;
            const offset = new THREE.Vector3(0, 8, 12);
            
            // Calculate desired camera position
            const desiredPosition = ballPosition.clone().add(offset);
            
            // Smoothly interpolate camera position
            this.camera.position.lerp(desiredPosition, 0.05);
            this.controls.target.lerp(ballPosition, 0.05);
        }

        // Update controls
        this.controls.update();
    }

    // Position camera for aiming
    setAimingView(ballPosition, aimDirection) {
        if (!this.followingBall) {
            const distance = 10;
            const height = 5;
            
            // Calculate camera position based on aim direction
            const radians = (aimDirection * Math.PI) / 180;
            const offsetX = Math.sin(radians) * distance;
            const offsetZ = Math.cos(radians) * distance;
            
            const targetPosition = new THREE.Vector3(
                ballPosition.x - offsetX,
                ballPosition.y + height,
                ballPosition.z - offsetZ
            );
            
            // Smoothly move camera
            this.camera.position.lerp(targetPosition, 0.1);
            this.controls.target.lerp(ballPosition, 0.1);
        }
    }

    // Get camera position for shot calculation
    getCameraDirection() {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        return direction;
    }

    // Show temporary message
    showMessage(text) {
        const messageDisplay = document.getElementById('message-display');
        if (messageDisplay) {
            messageDisplay.textContent = text;
            messageDisplay.style.display = 'block';
            
            setTimeout(() => {
                messageDisplay.style.display = 'none';
            }, 2000);
        }
    }

    // Animate camera to a specific position
    animateTo(position, target, duration = 1000) {
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-in-out)
            const eased = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;

            // Interpolate position and target
            this.camera.position.lerpVectors(startPosition, position, eased);
            this.controls.target.lerpVectors(startTarget, target, eased);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Set camera for hole overview
    setHoleOverview(holePosition, holeNumber) {
        let cameraPos, targetPos;
        
        switch (holeNumber) {
            case 1:
                cameraPos = new THREE.Vector3(0, 20, 25);
                targetPos = new THREE.Vector3(0, 0, 0);
                break;
            case 2:
                cameraPos = new THREE.Vector3(-10, 18, 20);
                targetPos = new THREE.Vector3(-5, 0, -10);
                break;
            default:
                cameraPos = new THREE.Vector3(0, 15, 20);
                targetPos = new THREE.Vector3(0, 0, 0);
        }
        
        this.animateTo(cameraPos, targetPos);
    }

    // Enable/disable controls
    setControlsEnabled(enabled) {
        this.controls.enabled = enabled;
    }

    // Get current view information
    getViewInfo() {
        return {
            position: this.camera.position.clone(),
            target: this.controls.target.clone(),
            distance: this.controls.getDistance(),
            azimuthAngle: this.controls.getAzimuthalAngle(),
            polarAngle: this.controls.getPolarAngle()
        };
    }
}
