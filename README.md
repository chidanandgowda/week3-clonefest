##  How to Play

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

## File Structure
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
