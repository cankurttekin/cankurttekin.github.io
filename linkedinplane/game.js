// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set actual canvas dimensions (different from CSS dimensions)
canvas.width = 1200;
canvas.height = 800;

// Game variables
let plane = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 32,
    height: 32,
    angle: 0,
    speed: 2,
    color: '#ff0000',
    currentPathIndex: 0,
    path: [],
    targetReached: true,
    isAnimating: false,
    sprite: null,
    animationFrame: 0,
    frameCount: 0
};

let target = null;
let tempTarget = null; // Used for preview while dragging
let controlPoints = [];
let isDragging = false;
let invalidTarget = false; // Flag to indicate if target is in invalid area

// Pixel art plane sprite (16x16 pixels scaled up)
// 0: transparent, 1: outline, 2: main body, 3: cockpit, 4: wings highlight
const planeSprite = [
    [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
    [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
    [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
    [0,0,1,4,4,4,2,2,2,2,4,4,4,1,0,0],
    [0,1,4,4,4,4,2,2,2,2,4,4,4,4,1,0],
    [1,1,1,1,1,2,2,2,2,2,2,1,1,1,1,1],
    [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
    [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
    [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
    [0,0,0,0,1,2,2,3,3,2,2,1,0,0,0,0],
    [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,3,3,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0]
];

// Color palette
const colors = {
    transparent: 'rgba(0,0,0,0)',
    outline: '#ffffff',
    body: '#ff0000',
    cockpit: '#00ccff',
    wings: '#ff9900',
    background: '#003366',
    invalidArea: 'rgba(255, 0, 0, 0.1)'
};

// Target indicator animation
let targetIndicator = {
    radius: 20,
    maxRadius: 30,
    minRadius: 15,
    expanding: true,
    speed: 0.2
};

// Load assets
function init() {
    // Create pixel art sprites
    createPixelArtSprites();
    
    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Create pixel art sprites
function createPixelArtSprites() {
    plane.sprite = document.createElement('canvas');
    plane.sprite.width = plane.width;
    plane.sprite.height = plane.height;
    
    const spriteCtx = plane.sprite.getContext('2d');
    const pixelSize = plane.width / planeSprite[0].length;
    
    for (let y = 0; y < planeSprite.length; y++) {
        for (let x = 0; x < planeSprite[y].length; x++) {
            let color;
            switch (planeSprite[y][x]) {
                case 0: color = colors.transparent; break;
                case 1: color = colors.outline; break;
                case 2: color = colors.body; break;
                case 3: color = colors.cockpit; break;
                case 4: color = colors.wings; break;
                default: color = colors.transparent;
            }
            
            spriteCtx.fillStyle = color;
            spriteCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }
}

// Get canvas coordinates from mouse event
function getCanvasCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * (canvas.width / canvas.clientWidth),
        y: (event.clientY - rect.top) * (canvas.height / canvas.clientHeight)
    };
}

// Check if a point is in the plane's forward area (within 90 degrees of current angle)
function isInForwardArea(point) {
    // Calculate vector from plane to point
    const dx = point.x - plane.x;
    const dy = point.y - plane.y;
    
    // Get the angle of this vector
    const pointAngle = Math.atan2(dy, dx);
    
    // Calculate the difference between the point angle and plane angle
    let angleDiff = pointAngle - plane.angle;
    
    // Normalize the angle difference to be between -π and π
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    
    // Check if the angle difference is within the allowed range (-π/2 to π/2 = 90 degrees in each direction)
    const inForwardSector = Math.abs(angleDiff) <= Math.PI / 2;
    
    return inForwardSector;
}

// Handle mouse down events
function handleMouseDown(event) {
    isDragging = true;
    const coords = getCanvasCoordinates(event);
    tempTarget = { x: coords.x, y: coords.y };
    invalidTarget = !isInForwardArea(tempTarget);
    
    if (!invalidTarget) {
        generatePreviewPath();
    }
}

// Handle mouse move events
function handleMouseMove(event) {
    if (isDragging) {
        const coords = getCanvasCoordinates(event);
        tempTarget = { x: coords.x, y: coords.y };
        invalidTarget = !isInForwardArea(tempTarget);
        
        if (!invalidTarget) {
            generatePreviewPath();
        }
    }
}

// Handle mouse up events
function handleMouseUp(event) {
    if (isDragging) {
        isDragging = false;
        const coords = getCanvasCoordinates(event);
        
        // Only set the target if it's in the forward area
        if (isInForwardArea(coords)) {
            target = { x: coords.x, y: coords.y };
            generatePath();
        }
        
        tempTarget = null;
        invalidTarget = false;
    }
}

// Generate a preview path while dragging
function generatePreviewPath() {
    if (!tempTarget || invalidTarget) return;
    generatePathWithTarget(tempTarget, true);
}

// Generate the final path when mouse up
function generatePath() {
    if (!target) return;
    generatePathWithTarget(target, false);
}

// Generate a path with Bezier curve control points
function generatePathWithTarget(targetPoint, isPreview) {
    // Start at current plane position
    const startPoint = { x: plane.x, y: plane.y };
    
    // Calculate direction vector
    const dx = targetPoint.x - startPoint.x;
    const dy = targetPoint.y - startPoint.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    // Get the target direction relative to plane's current angle
    const targetAngle = Math.atan2(dy, dx);
    let angleDiff = targetAngle - plane.angle;
    
    // Normalize the angle difference to be between -π and π
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    
    // Direction of the curve bend based on whether the target is to the left or right of the plane's forward vector
    const curveDirection = Math.sign(angleDiff);
    
    // Create control points for a smooth curve that respects plane's forward motion
    controlPoints = [startPoint];
    
    // First control point: move forward from the plane at current angle
    controlPoints.push({
        x: startPoint.x + Math.cos(plane.angle) * distance * 0.3,
        y: startPoint.y + Math.sin(plane.angle) * distance * 0.3
    });
    
    // Second control point: gradually turn toward target
    controlPoints.push({
        x: startPoint.x + Math.cos(plane.angle + angleDiff * 0.7) * distance * 0.6,
        y: startPoint.y + Math.sin(plane.angle + angleDiff * 0.7) * distance * 0.6
    });
    
    // Final point is the target
    controlPoints.push(targetPoint);
    
    // Generate points along the Bezier curve
    const pathPoints = [];
    const steps = Math.max(50, Math.floor(distance / 5));
    
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const point = getBezierPoint(t, controlPoints[0], controlPoints[1], controlPoints[2], controlPoints[3]);
        pathPoints.push(point);
    }
    
    if (isPreview) {
        // Just update the points for preview
        plane.previewPath = pathPoints;
    } else {
        // Set as the actual path and reset path index
        plane.path = pathPoints;
        plane.currentPathIndex = 0;
        plane.targetReached = false;
        plane.previewPath = null;
    }
}

// Calculate a point on a cubic Bezier curve at time t
function getBezierPoint(t, p0, p1, p2, p3) {
    const cX = 3 * (p1.x - p0.x);
    const bX = 3 * (p2.x - p1.x) - cX;
    const aX = p3.x - p0.x - cX - bX;
    
    const cY = 3 * (p1.y - p0.y);
    const bY = 3 * (p2.y - p1.y) - cY;
    const aY = p3.y - p0.y - cY - bY;
    
    const x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
    const y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;
    
    return { x, y };
}

// Update game state
function update() {
    // Update target indicator animation
    if (target) {
        if (targetIndicator.expanding) {
            targetIndicator.radius += targetIndicator.speed;
            if (targetIndicator.radius >= targetIndicator.maxRadius) {
                targetIndicator.expanding = false;
            }
        } else {
            targetIndicator.radius -= targetIndicator.speed;
            if (targetIndicator.radius <= targetIndicator.minRadius) {
                targetIndicator.expanding = true;
            }
        }
    }
    
    // Update plane animation
    plane.frameCount++;
    if (plane.frameCount >= 5) {
        plane.frameCount = 0;
        plane.animationFrame = (plane.animationFrame + 1) % 4;
    }
    
    // Move plane along path
    if (!plane.targetReached && plane.path.length > 0) {
        // Get current target point on path
        const targetPoint = plane.path[plane.currentPathIndex];
        
        // Move plane to the point
        plane.x = targetPoint.x;
        plane.y = targetPoint.y;
        
        // Calculate angle based on the next point in the path
        if (plane.currentPathIndex < plane.path.length - 1) {
            const nextPoint = plane.path[plane.currentPathIndex + 1];
            plane.angle = Math.atan2(nextPoint.y - plane.y, nextPoint.x - plane.x);
        }
        
        // Move to next point in path
        plane.currentPathIndex++;
        
        // Check if we've reached the end of the path
        if (plane.currentPathIndex >= plane.path.length) {
            plane.targetReached = true;
        }
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw preview path (while dragging)
    if (isDragging && !invalidTarget && plane.previewPath && plane.previewPath.length > 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(plane.previewPath[0].x, plane.previewPath[0].y);
        
        for (let i = 1; i < plane.previewPath.length; i++) {
            ctx.lineTo(plane.previewPath[i].x, plane.previewPath[i].y);
        }
        
        ctx.stroke();
        
        // Draw temporary target
        if (tempTarget) {
            drawTarget(tempTarget, 'rgba(255, 255, 0, 0.5)');
        }
    }
    
    // Show invalid target indicator
    if (isDragging && invalidTarget && tempTarget) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tempTarget.x, tempTarget.y, targetIndicator.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw X
        const crossSize = 10;
        ctx.beginPath();
        ctx.moveTo(tempTarget.x - crossSize, tempTarget.y - crossSize);
        ctx.lineTo(tempTarget.x + crossSize, tempTarget.y + crossSize);
        ctx.moveTo(tempTarget.x + crossSize, tempTarget.y - crossSize);
        ctx.lineTo(tempTarget.x - crossSize, tempTarget.y + crossSize);
        ctx.stroke();
    }
    
    // Draw actual path
    if (plane.path.length > 0 && !plane.targetReached) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(plane.path[0].x, plane.path[0].y);
        
        for (let i = 1; i < plane.path.length; i++) {
            ctx.lineTo(plane.path[i].x, plane.path[i].y);
        }
        
        ctx.stroke();
    }
    
    // Draw actual target
    if (target) {
        drawTarget(target, '#ffff00');
    }
    
    // Draw plane
    ctx.save();
    ctx.translate(plane.x, plane.y);
    ctx.rotate(plane.angle);
    ctx.drawImage(
        plane.sprite,
        -plane.width / 2,
        -plane.height / 2,
        plane.width,
        plane.height
    );
    ctx.restore();
}

// Draw the forward area of the plane (where targets can be placed)
function drawForwardArea() {
    const radius = 300;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.05)';
    ctx.beginPath();
    ctx.moveTo(plane.x, plane.y);
    ctx.arc(plane.x, plane.y, radius, plane.angle - Math.PI/2, plane.angle + Math.PI/2);
    ctx.lineTo(plane.x, plane.y);
    ctx.fill();
    
    // Draw the border of the forward area
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plane.x, plane.y);
    ctx.lineTo(
        plane.x + Math.cos(plane.angle - Math.PI/2) * radius,
        plane.y + Math.sin(plane.angle - Math.PI/2) * radius
    );
    ctx.arc(plane.x, plane.y, radius, plane.angle - Math.PI/2, plane.angle + Math.PI/2);
    ctx.lineTo(plane.x, plane.y);
    ctx.stroke();
}

// Helper function to draw target indicators
function drawTarget(targetPoint, color) {
    // Animated circle
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(targetPoint.x, targetPoint.y, targetIndicator.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Center dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(targetPoint.x, targetPoint.y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw X
    const crossSize = 5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(targetPoint.x - crossSize, targetPoint.y - crossSize);
    ctx.lineTo(targetPoint.x + crossSize, targetPoint.y + crossSize);
    ctx.moveTo(targetPoint.x + crossSize, targetPoint.y - crossSize);
    ctx.lineTo(targetPoint.x - crossSize, targetPoint.y + crossSize);
    ctx.stroke();
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
window.onload = init; 