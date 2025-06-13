// Canvas class to handle all drawing and functionality for each canvas
class CircleCanvas {
    constructor(canvasId, dataElementId, colors, markerYPositions) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dataElement = document.getElementById(dataElementId);
        
        // Canvas and circle properties
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = 150;
        
        // Y positions for markers (0.197 to 1, where 0.197 is bottom and 1 is top)
        // Use provided positions or default if not provided
        this.markerYPositions = markerYPositions;
        this.dataElement.textContent = this.markerYPositions;
        
        // Colors for sectors between adjacent markers
        this.sectorColors = colors;
        
        // Initial draw
        this.draw();
    }
    
    drawCircle() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }
    
    calculateMarkerPosition(yNormalized) {
        // Convert normalized y (0.197-1) to actual y coordinate
        // Map the range 0.197-1 to the full circle height
        const normalizedRange = (yNormalized - 0.197) / (1 - 0.197);
        const actualY = this.centerY + this.radius - (normalizedRange * 2 * this.radius);
        
        // Calculate x coordinate using circle equation: x² + y² = r²
        const yFromCenter = actualY - this.centerY;
        const xFromCenter = Math.sqrt(this.radius * this.radius - yFromCenter * yFromCenter);
        
        // Return both possible x positions (left and right side of circle)
        return {
            left: { x: this.centerX - xFromCenter, y: actualY },
            right: { x: this.centerX + xFromCenter, y: actualY }
        };
    }
    
    drawMarker(x, y) {
        // Draw marker circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawMarkers() {
        this.markerYPositions.forEach((yPos, index) => {
            const positions = this.calculateMarkerPosition(yPos);
            
            // Draw markers on both sides of the circle
            this.drawMarker(positions.left.x, positions.left.y);
            this.drawMarker(positions.right.x, positions.right.y);
        });
    }
    
    drawYAxis() {
        const axisX = 60; // X position for the y-axis (moved further left)
        const axisStartY = this.centerY - this.radius;
        const axisEndY = this.centerY + this.radius;
        
        // Draw the main axis line
        this.ctx.beginPath();
        this.ctx.moveTo(axisX, axisStartY);
        this.ctx.lineTo(axisX, axisEndY);
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw tick marks and labels
        const tickValues = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
        
        tickValues.forEach(value => {
            // Calculate y position for this tick
            const normalizedRange = (value - 0.197) / (1 - 0.197);
            const tickY = this.centerY + this.radius - (normalizedRange * 2 * this.radius);
            
            // Draw tick mark
            this.ctx.beginPath();
            this.ctx.moveTo(axisX - 5, tickY);
            this.ctx.lineTo(axisX + 5, tickY);
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // Draw label
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(value.toFixed(1), axisX - 10, tickY + 4);
        });
        
        // Draw axis label
        this.ctx.save();
        this.ctx.translate(10, this.centerY); // Moved label further left as well
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Y Position', 0, 0);
        this.ctx.restore();
    }
    
    drawSector(angle1, angle2, color) {
        // Draw sector between two angles
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.arc(this.centerX, this.centerY, this.radius, angle1, angle2);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 0.0001;
        this.ctx.stroke();
    }
    
    drawSectors() {
        // Calculate all marker angles around the circle
        const allAngles = [];
        
        this.markerYPositions.forEach(yPos => {
            const normalizedRange = (yPos - 0.197) / (1 - 0.197);
            const actualY = this.centerY + this.radius - (normalizedRange * 2 * this.radius);
            const yFromCenter = actualY - this.centerY;
            const xFromCenter = Math.sqrt(this.radius * this.radius - yFromCenter * yFromCenter);
            
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
            const colorIndex = i % this.sectorColors.length;
            
            this.drawSector(allAngles[currentIndex], allAngles[nextIndex], this.sectorColors[colorIndex]);
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw y-axis
        this.drawYAxis();
        
        // Draw sectors
        this.drawSectors();
        
        // Draw circle
        this.drawCircle();
        
        // Draw markers
        this.drawMarkers();
    }
    
    // Method to update colors
    updateColors(newColors) {
        this.sectorColors = newColors;
        this.draw();
    }
    
    // Method to update marker positions
    updateMarkerPositions(newPositions) {
        this.markerYPositions = newPositions;
        this.dataElement.textContent = this.markerYPositions;
        this.draw();
    }
}

// Define colors for both canvases
const blue1 = "#6666ff";
const blue2 = "#8888ff";
const blue3 = "#aaaaff";
const yellow1 = "#ffff66";
const yellow2 = "#ffff99";
const yellow3 = "#ffffcc";
const red1 = "#ff6666";
const red2 = "#ff9999";
const red3 = "#ffcccc";
const green1 = "#66ff66";
const green2 = "#99ff99";
const green3 = "#ccffcc";

// Colors for Canvas 1
const canvas1Colors = [
    yellow2, yellow1, yellow2, yellow2, 
    yellow3, blue3, blue2, blue2,
    blue1, blue2, blue1, blue2, 
    blue2, blue3, yellow3, yellow2
];

// Different colors for Canvas 2
const canvas2Colors = [
    red2, red1, red2, red2, 
    red3, green3, green2, green2,
    green1, green2, green1, green2, 
    green2, green3, red3, red2
];

// Define different marker positions for each canvas
const canvas1v2MarkerPositions = [0.197, 0.4, 0.599, 0.8, 1];
const canvas1MarkerPositions = [0.197, 0.299, 0.4, 0.5, 0.599, 0.7, 0.8, 0.9, 1];
const canvas2MarkerPositions = [0.197, 0.25, 0.299, 0.35, 0.4, 0.45, 0.5, 0.55, 0.599, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
const canvas3MarkerPositions = [0.197, 0.25, 0.299, 0.35, 0.4, 0.45, 0.5, 0.55, 0.599, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];

// Create the two canvas instances with different marker positions
const canvas1 = new CircleCanvas('circleCanvas1', 'markerYValueData1', canvas1Colors, canvas1MarkerPositions);

// Example of how to update a specific canvas
// To be used for future functionality:
// canvas1.updateColors(newColorsArray);
// canvas2.updateMarkerPositions(newPositionsArray);
