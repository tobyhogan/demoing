const canvas = document.getElementById('circleCanvas');
const ctx = canvas.getContext('2d');

// Canvas and circle properties
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 150;

// Y positions for markers (0.197 to 1, where 0.197 is bottom and 1 is top)
//const markerYPositions = [0.197, 0.299, 0.4, 0.5, 0.599, 0.7, 0.8, 0.9, 1];

const markerYPositions = [0.197, 0.299, 0.4, 0.5, 0.599, 0.7, 0.8, 0.9, 1];


const element = document.getElementById('markerYValueData');
element.textContent = markerYPositions;



const blue1 = "#6666ff"
const blue2 = "#8888ff"
const blue3 = "#aaaaff"
const yellow1 = "#ffff66"
const yellow2 = "#ffff99"
const yellow3 = "#ffffcc"

// Colors for sectors between adjacent markers
const sectorColors = [
    yellow2, yellow1, yellow2, yellow2, 
    yellow3, blue3, blue2, blue2,
    blue1, blue2, blue1, blue2, 
    blue2, blue3, yellow3, yellow2
];

function drawCircle() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function calculateMarkerPosition(yNormalized) {
    // Convert normalized y (0.197-1) to actual y coordinate
    // Map the range 0.197-1 to the full circle height
    const normalizedRange = (yNormalized - 0.197) / (1 - 0.197);
    const actualY = centerY + radius - (normalizedRange * 2 * radius);
    
    // Calculate x coordinate using circle equation: x² + y² = r²
    const yFromCenter = actualY - centerY;
    const xFromCenter = Math.sqrt(radius * radius - yFromCenter * yFromCenter);
    
    // Return both possible x positions (left and right side of circle)
    return {
        left: { x: centerX - xFromCenter, y: actualY },
        right: { x: centerX + xFromCenter, y: actualY }
    };
}

function drawMarker(x, y) {
    // Draw marker circle
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawMarkers() {
    markerYPositions.forEach((yPos, index) => {
        const positions = calculateMarkerPosition(yPos);
        
        // Draw markers on both sides of the circle
        drawMarker(positions.left.x, positions.left.y);
        drawMarker(positions.right.x, positions.right.y);
    });
}

function drawYAxis() {
    const axisX = 60; // X position for the y-axis (moved further left)
    const axisStartY = centerY - radius;
    const axisEndY = centerY + radius;
    
    // Draw the main axis line
    ctx.beginPath();
    ctx.moveTo(axisX, axisStartY);
    ctx.lineTo(axisX, axisEndY);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw tick marks and labels
    const tickValues = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    
    tickValues.forEach(value => {
        // Calculate y position for this tick
        const normalizedRange = (value - 0.197) / (1 - 0.197);
        const tickY = centerY + radius - (normalizedRange * 2 * radius);
        
        // Draw tick mark
        ctx.beginPath();
        ctx.moveTo(axisX - 5, tickY);
        ctx.lineTo(axisX + 5, tickY);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(value.toFixed(1), axisX - 10, tickY + 4);
    });
    
    // Draw axis label
    ctx.save();
    ctx.translate(10, centerY); // Moved label further left as well
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Y Position', 0, 0);
    ctx.restore();
}

function drawSector(angle1, angle2, color) {
    // Draw sector between two angles
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle1, angle2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawSectors() {
    // Calculate all marker angles around the circle
    const allAngles = [];
    
    markerYPositions.forEach(yPos => {
        const normalizedRange = (yPos - 0.197) / (1 - 0.197);
        const actualY = centerY + radius - (normalizedRange * 2 * radius);
        const yFromCenter = actualY - centerY;
        const xFromCenter = Math.sqrt(radius * radius - yFromCenter * yFromCenter);
        
        // Calculate angles using atan2 for proper quadrant handling
        const leftAngle = Math.atan2(yFromCenter, -xFromCenter);
        const rightAngle = Math.atan2(yFromCenter, xFromCenter);
        
        allAngles.push(leftAngle);
        allAngles.push(rightAngle);
    });
    
    // Sort angles and adjust to start from the top (negative PI/2)
    allAngles.sort((a, b) => a - b);
    
    // Find the index of the angle closest to the top of the circle (-PI/2)
    const topAngle = -Math.PI / 2;
    let startIndex = 0;
    let minDiff = Math.abs(allAngles[0] - topAngle);
    
    for (let i = 1; i < allAngles.length; i++) {
        const diff = Math.abs(allAngles[i] - topAngle);
        if (diff < minDiff) {
            minDiff = diff;
            startIndex = i;
        }
    }
    
    // Draw sectors between consecutive angles, starting from the top
    const totalSectors = allAngles.length;
    
    for (let i = 0; i < totalSectors; i++) {
        const currentIndex = (startIndex + i) % totalSectors;
        const nextIndex = (startIndex + i + 1) % totalSectors;
        
        // Use colors in order directly from the sectorColors array
        // This creates a clockwise pattern starting from the top
        const colorIndex = i % sectorColors.length;
        
        drawSector(allAngles[currentIndex], allAngles[nextIndex], sectorColors[colorIndex]);
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw y-axis
    drawYAxis();
    
    // Draw sectors
    drawSectors();
    
    // Draw circle
    drawCircle();
    
    // Draw markers
    drawMarkers();
}

// Initial draw
draw();
