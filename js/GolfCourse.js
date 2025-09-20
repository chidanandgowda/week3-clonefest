/**
 * GolfCourse.js - Handles the 3D scene, golf course geometry, and physics
 */

class GolfCourse {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.ball = null;
        this.holes = [];
        this.currentHole = 0;
        this.ballVelocity = new THREE.Vector3(0, 0, 0);
        this.isMoving = false;
        this.friction = 0.98;
        this.gravity = -0.02;
        this.bounceReduction = 0.6;
        this.aimHelper = null;
        this.powerHelper = null;
        
        this.initializeScene();
        this.createLighting();
        this.createBall();
        this.createCourse();
        this.createAimingHelpers();
    }

    initializeScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('game-canvas'),
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB);
    }

    createLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        
        // Configure shadow properties
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        
        this.scene.add(directionalLight);

        // Additional fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-30, 20, -30);
        this.scene.add(fillLight);
    }

    createCourse() {
        this.holes = [
            this.createHole1(),
            this.createHole2()
        ];
        
        // Start with hole 1
        this.loadHole(0);
    }

    createHole1() {
        const holeGroup = new THREE.Group();

        // Ground/Green
        const groundGeometry = new THREE.PlaneGeometry(40, 60);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        holeGroup.add(ground);

        // Tee area (darker green)
        const teeGeometry = new THREE.CircleGeometry(3, 16);
        const teeMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 });
        const tee = new THREE.Mesh(teeGeometry, teeMaterial);
        tee.rotation.x = -Math.PI / 2;
        tee.position.set(0, 0.01, 20);
        holeGroup.add(tee);

        // Hole/Cup
        const holeGeometry = new THREE.CircleGeometry(0.5, 16);
        const holeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.rotation.x = -Math.PI / 2;
        hole.position.set(0, 0.01, -20);
        holeGroup.add(hole);

        // Flag
        this.createFlag(holeGroup, new THREE.Vector3(0, 0, -20));

        // Sand bunkers
        const bunker1 = this.createBunker(-8, -10, 4);
        const bunker2 = this.createBunker(8, -15, 3);
        holeGroup.add(bunker1);
        holeGroup.add(bunker2);

        // Trees for decoration
        const tree1 = this.createTree(-15, 0, 10);
        const tree2 = this.createTree(15, 0, -5);
        const tree3 = this.createTree(-12, 0, -25);
        holeGroup.add(tree1);
        holeGroup.add(tree2);
        holeGroup.add(tree3);

        return {
            group: holeGroup,
            startPosition: new THREE.Vector3(0, 0.2, 20),
            holePosition: new THREE.Vector3(0, 0, -20),
            par: 3,
            bounds: { minX: -20, maxX: 20, minZ: -30, maxZ: 30 }
        };
    }

    createHole2() {
        const holeGroup = new THREE.Group();

        // L-shaped course
        const ground1Geometry = new THREE.PlaneGeometry(25, 30);
        const ground1Material = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const ground1 = new THREE.Mesh(ground1Geometry, ground1Material);
        ground1.rotation.x = -Math.PI / 2;
        ground1.position.set(0, 0, 0);
        ground1.receiveShadow = true;
        holeGroup.add(ground1);

        const ground2Geometry = new THREE.PlaneGeometry(30, 25);
        const ground2Material = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const ground2 = new THREE.Mesh(ground2Geometry, ground2Material);
        ground2.rotation.x = -Math.PI / 2;
        ground2.position.set(-15, 0, -20);
        ground2.receiveShadow = true;
        holeGroup.add(ground2);

        // Tee area
        const teeGeometry = new THREE.CircleGeometry(3, 16);
        const teeMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 });
        const tee = new THREE.Mesh(teeGeometry, teeMaterial);
        tee.rotation.x = -Math.PI / 2;
        tee.position.set(0, 0.01, 12);
        holeGroup.add(tee);

        // Hole/Cup
        const holeGeometry = new THREE.CircleGeometry(0.5, 16);
        const holeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.rotation.x = -Math.PI / 2;
        hole.position.set(-15, 0.01, -30);
        holeGroup.add(hole);

        // Flag
        this.createFlag(holeGroup, new THREE.Vector3(-15, 0, -30));

        // Water hazard
        const waterGeometry = new THREE.PlaneGeometry(12, 8);
        const waterMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x0077BE,
            transparent: true,
            opacity: 0.8
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2;
        water.position.set(-5, 0.01, -8);
        holeGroup.add(water);

        // Sand bunkers
        const bunker1 = this.createBunker(8, -5, 3);
        const bunker2 = this.createBunker(-20, -25, 4);
        holeGroup.add(bunker1);
        holeGroup.add(bunker2);

        // More trees
        const tree1 = this.createTree(10, 0, 5);
        const tree2 = this.createTree(-25, 0, -10);
        const tree3 = this.createTree(-8, 0, -35);
        holeGroup.add(tree1);
        holeGroup.add(tree2);
        holeGroup.add(tree3);

        return {
            group: holeGroup,
            startPosition: new THREE.Vector3(0, 0.2, 12),
            holePosition: new THREE.Vector3(-15, 0, -30),
            par: 4,
            bounds: { minX: -30, maxX: 15, minZ: -35, maxZ: 15 }
        };
    }

    createFlag(parent, position) {
        // Flag pole
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(position.x, 1.5, position.z);
        parent.add(pole);

        // Flag
        const flagGeometry = new THREE.PlaneGeometry(1.5, 1);
        const flagMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFF0000,
            side: THREE.DoubleSide
        });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(position.x + 0.75, 2.5, position.z);
        parent.add(flag);
    }

    createBunker(x, z, radius) {
        const bunkerGeometry = new THREE.CircleGeometry(radius, 16);
        const bunkerMaterial = new THREE.MeshLambertMaterial({ color: 0xF4A460 });
        const bunker = new THREE.Mesh(bunkerGeometry, bunkerMaterial);
        bunker.rotation.x = -Math.PI / 2;
        bunker.position.set(x, 0.01, z);
        return bunker;
    }

    createTree(x, y, z) {
        const treeGroup = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Leaves
        const leavesGeometry = new THREE.SphereGeometry(2.5, 8, 6);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 5;
        leaves.castShadow = true;
        treeGroup.add(leaves);

        treeGroup.position.set(x, y, z);
        return treeGroup;
    }

    createBall() {
        const ballGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.castShadow = true;
        this.ball.receiveShadow = true;
        
        // Set initial position (will be updated when holes are loaded)
        this.ball.position.set(0, 0.2, 20);
        
        this.scene.add(this.ball);
    }

    createAimingHelpers() {
        // Aim direction arrow
        const arrowGeometry = new THREE.ConeGeometry(0.2, 1, 8);
        const arrowMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFF0000,
            transparent: true,
            opacity: 0.7
        });
        this.aimHelper = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.aimHelper.visible = false;
        this.scene.add(this.aimHelper);

        // Power indicator (line)
        const powerGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
        const powerMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x00FF00,
            transparent: true,
            opacity: 0.8
        });
        this.powerHelper = new THREE.Mesh(powerGeometry, powerMaterial);
        this.powerHelper.visible = false;
        this.scene.add(this.powerHelper);
    }

    loadHole(holeIndex) {
        // Remove current hole from scene
        if (this.currentHoleGroup) {
            this.scene.remove(this.currentHoleGroup);
        }

        this.currentHole = holeIndex;
        const holeData = this.holes[holeIndex];
        
        if (!holeData) {
            console.error(`Hole data not found for index ${holeIndex}`);
            return;
        }
        
        this.currentHoleGroup = holeData.group;
        this.scene.add(this.currentHoleGroup);

        // Reset ball position (only if ball exists)
        if (this.ball && holeData.startPosition) {
            this.ball.position.copy(holeData.startPosition);
        }
        this.ballVelocity.set(0, 0, 0);
        this.isMoving = false;
    }

    updateAimingHelpers(direction, power) {
        if (!this.ball || this.isMoving) {
            this.aimHelper.visible = false;
            this.powerHelper.visible = false;
            return;
        }

        const ballPos = this.ball.position;
        const radians = (direction * Math.PI) / 180;

        // Update aim arrow
        this.aimHelper.visible = true;
        this.aimHelper.position.set(
            ballPos.x + Math.sin(radians) * 2,
            ballPos.y + 0.5,
            ballPos.z + Math.cos(radians) * 2
        );
        this.aimHelper.rotation.y = -radians;

        // Update power indicator
        this.powerHelper.visible = true;
        const powerScale = (power / 100) * 3;
        this.powerHelper.scale.y = powerScale;
        this.powerHelper.position.set(
            ballPos.x + Math.sin(radians) * (1 + powerScale / 2),
            ballPos.y + powerScale / 2,
            ballPos.z + Math.cos(radians) * (1 + powerScale / 2)
        );
        this.powerHelper.rotation.y = -radians;
        this.powerHelper.rotation.z = Math.PI / 2;
    }

    shootBall(direction, power) {
        if (this.isMoving) return false;

        const radians = (direction * Math.PI) / 180;
        const force = (power / 100) * 0.8;

        this.ballVelocity.set(
            Math.sin(radians) * force,
            0,
            Math.cos(radians) * force
        );

        this.isMoving = true;
        this.aimHelper.visible = false;
        this.powerHelper.visible = false;

        return true;
    }

    updatePhysics() {
        if (!this.isMoving) return;

        const currentHole = this.holes[this.currentHole];

        // Apply velocity to ball position
        this.ball.position.add(this.ballVelocity);

        // Apply gravity
        this.ballVelocity.y += this.gravity;

        // Ground collision
        if (this.ball.position.y <= 0.2) {
            this.ball.position.y = 0.2;
            if (this.ballVelocity.y < 0) {
                this.ballVelocity.y *= -this.bounceReduction;
            }
        }

        // Apply friction
        this.ballVelocity.multiplyScalar(this.friction);

        // Check boundaries
        const bounds = currentHole.bounds;
        if (this.ball.position.x < bounds.minX || this.ball.position.x > bounds.maxX ||
            this.ball.position.z < bounds.minZ || this.ball.position.z > bounds.maxZ) {
            // Ball went out of bounds - reset to start
            this.resetBallToStart();
            return 'out_of_bounds';
        }

        // Check if ball stopped
        if (this.ballVelocity.length() < 0.01) {
            this.ballVelocity.set(0, 0, 0);
            this.isMoving = false;
        }

        // Check if ball is in hole
        const distanceToHole = this.ball.position.distanceTo(currentHole.holePosition);
        if (distanceToHole < 0.6) {
            this.ballVelocity.set(0, 0, 0);
            this.isMoving = false;
            return 'hole_complete';
        }

        return 'moving';
    }

    resetBallToStart() {
        const currentHoleData = this.holes[this.currentHole];
        this.ball.position.copy(currentHoleData.startPosition);
        this.ballVelocity.set(0, 0, 0);
        this.isMoving = false;
    }

    getCurrentHoleData() {
        return this.holes[this.currentHole];
    }

    getBallPosition() {
        return this.ball.position.clone();
    }

    isBallMoving() {
        return this.isMoving;
    }

    getScene() {
        return this.scene;
    }

    getRenderer() {
        return this.renderer;
    }

    getCamera() {
        return this.camera;
    }

    getBall() {
        return this.ball;
    }
}
