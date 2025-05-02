# Pixel Plane Pathfinder

A 2D pixel art style game where a plane follows a curved path toward a target destination using Bezier curves.

## Features

- Detailed pixel art airplane with colored components (cockpit, wings, body)
- Large canvas (1200x800) for more immersive gameplay
- Smooth plane movement along Bezier curves
- Dynamic drag mechanics to set waypoints with real-time path preview
- Realistic flight constraints (plane can only fly forward, not sideways)
- Directional curves based on target position
- Target indicators with animations
- Fluid path following mechanics
- Solid color background for that retro arcade feel

## How to Play

1. Open `index.html` in your web browser
2. Click and drag to set a destination for your plane
3. The plane can only fly forward (within 90° of its current heading)
4. As you drag, you'll see a preview of the path the plane will follow
5. Release to confirm the destination and watch the plane follow the path
6. Drag again at any time to set a new destination

## Technical Details

- Built with vanilla JavaScript and HTML5 Canvas
- Uses cubic Bezier curves for smooth flight paths
- Implements pixel art rendering techniques
- Multi-colored pixel art sprites (16x16 grid)
- Responsive canvas sizing
- Dynamic path generation based on target position
- Realistic flight physics with forward-only movement constraints

## Development

To modify or enhance the game:

1. Edit `game.js` to adjust game mechanics
2. Modify `style.css` to change the visual style
3. Update the plane sprite in the `planeSprite` array in `game.js`

## License

This project is open source and available for personal and educational use.

## Credits

Created as a demonstration of Bezier curve path following and pixel art techniques in HTML5 Canvas. 