# 3D Golf Game

A web-based 3D golf game built with Three.js that demonstrates fundamental 3D graphics, physics simulation, and interactive gameplay.

## 🎯 Project Overview

This project is an introductory exercise in 3D web graphics, inspired by the open-source game "Open Golf." It provides a complete, interactive 3D golf experience with two challenging holes, realistic physics, and intuitive controls.

## ✨ Features

### Core Requirements ✅

1. **Scene and Asset Rendering**
   - Three.js scene with proper camera, lighting, and rendering
   - Two unique 3D golf course holes with different layouts
   - Realistic golf ball physics and movement
   - Environmental elements (trees, bunkers, flags)

2. **Basic Physics and Interaction**
   - User input system for ball velocity control
   - Simplified physics with friction, gravity, and bouncing
   - Realistic ball deceleration and stopping mechanics

3. **Core Gameplay and State Management**
   - Game state tracking (hole, par, strokes)
   - Goal detection system for hole completion
   - Two complete levels with different challenges

4. **Player Controls and Interaction**
   - **Aiming System**: 360-degree directional control with visual feedback
   - **Power Control**: Adjustable shot strength (0-100%)
   - **Visual Feedback**: Real-time aiming arrow and power indicator
   - **Keyboard Support**: Arrow keys for fine control, spacebar to shoot

5. **Camera System**
   - Interactive OrbitControls for scene inspection
   - Follow ball mode for tracking shots
   - Automatic camera positioning for each hole
   - Smooth camera transitions and animations

6. **User Interface**
   - Clean, modern HTML/CSS interface
   - Real-time display of game statistics
   - Interactive control panels
   - Responsive design for different screen sizes

### Bonus Features 🌟

- **Enhanced Level Design**: Two distinct holes with unique challenges
- **Advanced Physics**: Realistic ball bouncing and friction
- **Visual Effects**: Smooth animations and visual feedback
- **Game Statistics**: Score tracking and performance metrics
- **Accessibility**: Keyboard controls and clear visual indicators

## 🎮 How to Play

### Controls

**Mouse Controls:**
- **Left Click + Drag**: Rotate camera around the scene
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out

**Keyboard Controls:**
- **Arrow Keys**: Adjust aim direction and power
- **Spacebar/Enter**: Shoot the ball
- **R**: Restart current hole

**UI Controls:**
- **Direction Slider**: Set shot direction (0-360°)
- **Power Slider**: Set shot strength (0-100%)
- **Shoot Button**: Fire the ball
- **Reset Camera**: Return to default view
- **Follow Ball**: Toggle ball-following camera mode

### Gameplay

1. **Aim**: Use the direction slider or arrow keys to aim your shot
2. **Power**: Adjust the power slider or use up/down arrows for shot strength
3. **Shoot**: Click the "Shoot!" button or press spacebar to fire
4. **Navigate**: Use mouse controls to explore the course
5. **Goal**: Get the ball in the hole with the fewest strokes possible

### Scoring

- **Hole in One**: 1 stroke - Amazing!
- **Eagle**: 2 under par - Outstanding!
- **Birdie**: 1 under par - Great shot!
- **Par**: Equal to par - Nice work!
- **Bogey**: 1 over par - Keep trying!
- **Over Par**: More than 1 over - Practice makes perfect!

## 🏗️ Technical Architecture

### File Structure
```
week-3/
├── index.html          # Main HTML file with UI structure
├── styles.css          # Complete styling and responsive design
├── js/
│   ├── main.js         # Game initialization and main loop
│   ├── GolfCourse.js   # 3D scene, physics, and course geometry
│   ├── Camera.js       # Camera controls and positioning
│   ├── InputHandler.js # User input processing
│   └── UI.js           # User interface and game state management
└── README.md           # This documentation
```

### Key Components

1. **GolfCourse Class**: Manages 3D scene, physics simulation, and course geometry
2. **CameraController Class**: Handles camera movement, positioning, and animations
3. **InputHandler Class**: Processes user input and manages controls
4. **GameState Class**: Tracks game progress, scoring, and state management
5. **UIManager Class**: Manages user interface updates and interactions

### Physics System

- **Gravity**: Realistic ball falling with -0.02 acceleration
- **Friction**: 0.98 multiplier for gradual deceleration
- **Bouncing**: 0.6 reduction factor for realistic bounces
- **Collision Detection**: Ground and boundary collision handling
- **Out of Bounds**: Automatic ball reset with penalty stroke

## 🚀 Getting Started

### Prerequisites

- Modern web browser with WebGL support
- Internet connection (for Three.js CDN)

### Installation

1. **Clone or Download** the project files
2. **Open** `index.html` in a web browser
3. **Play** the game immediately - no build process required!

### Local Development

For local development, you can serve the files using any web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🎨 Course Design

### Hole 1: Classic Par 3
- **Layout**: Straight shot to the hole
- **Challenges**: Sand bunkers on both sides
- **Par**: 3 strokes
- **Strategy**: Aim carefully to avoid bunkers

### Hole 2: L-Shaped Par 4
- **Layout**: L-shaped course requiring strategic positioning
- **Challenges**: Water hazard and multiple bunkers
- **Par**: 4 strokes
- **Strategy**: Two-shot approach around the corner

## 🔧 Customization

### Adding New Holes

To add a new hole, modify the `GolfCourse.js` file:

```javascript
createHole3() {
    // Create your custom hole geometry
    const holeGroup = new THREE.Group();
    // Add course elements...
    
    return {
        group: holeGroup,
        startPosition: new THREE.Vector3(x, y, z),
        holePosition: new THREE.Vector3(x, y, z),
        par: 4,
        bounds: { minX: -20, maxX: 20, minZ: -30, maxZ: 30 }
    };
}
```

### Adjusting Physics

Modify physics constants in `GolfCourse.js`:

```javascript
this.friction = 0.98;        // Ball deceleration
this.gravity = -0.02;        // Downward acceleration
this.bounceReduction = 0.6;  // Bounce dampening
```

### Styling Changes

Customize the appearance by modifying `styles.css`:
- Colors and themes
- UI layout and positioning
- Responsive breakpoints
- Animation effects

## 🐛 Troubleshooting

### Common Issues

1. **Black Screen**: Check browser console for WebGL errors
2. **Controls Not Working**: Ensure JavaScript is enabled
3. **Performance Issues**: Try reducing browser zoom or closing other tabs
4. **Three.js Not Loading**: Check internet connection for CDN access

### Browser Compatibility

- **Chrome**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Full support ✅
- **Edge**: Full support ✅
- **Mobile**: Basic support (touch controls limited)

## 📈 Performance Optimization

- **Shadow Quality**: Adjustable shadow map resolution
- **Geometry Optimization**: Efficient mesh creation
- **Texture Management**: Optimized material usage
- **Render Loop**: Efficient animation frame handling

## 🎯 Future Enhancements

- **More Holes**: Additional course designs
- **Multiplayer**: Local or online multiplayer support
- **Advanced Physics**: Wind effects, ball spin
- **Course Editor**: User-created courses
- **Mobile Controls**: Touch-optimized interface
- **Sound Effects**: Audio feedback and ambient sounds
- **Particle Effects**: Ball trails and impact effects

## 📝 License

This project is created for educational purposes. Three.js is licensed under the MIT License.

## 🤝 Contributing

This is an educational project, but feel free to:
- Report bugs or issues
- Suggest improvements
- Create your own course designs
- Share gameplay screenshots

## 🏆 Achievements

Try to achieve these goals:
- Complete both holes under par
- Get a hole-in-one
- Complete the course in under 6 strokes total
- Master the camera controls for strategic viewing

---

**Enjoy playing 3D Golf!** 🏌️‍♂️⛳
