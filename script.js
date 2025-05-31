// Canvas class to handle all drawing and functionality for each canvas
class CircleCanvas {
    constructor(canvasId, dataElementId, sectorColors, oneSideSectorNum, sectorCount = 8) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dataElement = document.getElementById(dataElementId);
        
        // Canvas and circle properties
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = 150;
        
        // Number of sectors on one side of the circle
        this.oneSideSectorNum = oneSideSectorNum;
        this.dataElement.textContent = this.oneSideSectorNum;
        
        // Colors for the sectors
        this.sectorColors = sectorColors;
        
        // Calculate y positions for the sector boundaries
        this.sectorYPositions = this.calculateSectorYPositions();
        
        // Initial draw
        this.draw();
    }
    
    // Calculate evenly spaced y-positions for sector boundaries
    calculateSectorYPositions() {
        const yPositions = [];
        const minY = 0.197;  // Bottom of circle
        const maxY = 1.0;    // Top of circle
        const step = (maxY - minY) / this.oneSideSectorNum;
        
        for (let i = 0; i <= this.oneSideSectorNum; i++) {
            yPositions.push(minY + i * step);
        }
        
        return yPositions;
    }
    
    // Convert y-position to angle on the circle
    yPositionToAngle(yPos) {
        // Normalize the y position
        const normalizedY = (yPos - 0.197) / (1 - 0.197);
        
        // Map to the vertical position on the circle (-radius to radius)
        const yFromCenter = this.radius - (normalizedY * 2 * this.radius);
        
        // Calculate the angle using the arcsin function
        // y = radius * sin(angle) => angle = arcsin(y/radius)
        const angle = Math.asin(yFromCenter / this.radius);
        
        // Return the angle
        return angle;
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
        // Draw markers at sector boundaries
        this.sectorYPositions.forEach(yPos => {
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
        //this.ctx.strokeStyle = 'rgba(255, 255, 255, 0)';
        //this.ctx.lineWidth = 0;
        //this.ctx.stroke();
    }
    
    drawSectors() {
        // Calculate angles for each sector boundary
        const angles = [];
        for (let yPos of this.sectorYPositions) {
            angles.push(this.yPositionToAngle(yPos));
        }
        
        // Draw sectors on both sides (left and right)
        for (let i = 0; i < this.oneSideSectorNum; i++) {
            // Left side sector (negative angles)
            const leftStartAngle = -angles[i+1]; // Bottom angle of the sector
            const leftEndAngle = -angles[i];     // Top angle of the sector
            
            // Right side sector (positive angles)
            const rightStartAngle = angles[i+1]; // Bottom angle of the sector
            const rightEndAngle = angles[i];     // Top angle of the sector
            
            // Map sector index to one of 5 color zones (0-4)
            const colorZone = Math.floor(i * 5 / this.oneSideSectorNum);
            const color = this.sectorColors[colorZone];
            
            // Draw left and right sectors
            this.drawSector(leftStartAngle, leftEndAngle, color);
            this.drawSector(rightStartAngle, rightEndAngle, color);
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
    
    // Method to update sector count
    updateSectorCount(newCount) {
        this.oneSideSectorNum = newCount;
        this.dataElement.textContent = this.oneSideSectorNum;
        this.sectorYPositions = this.calculateSectorYPositions();
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
const canvas1Colors = [red1, red2, red3, yellow1, yellow2];

// Define different marker positions for each canvas
const canvas1OneSideSectorNum = 9;

const canvas1 = new CircleCanvas('circleCanvas1', 'markerYValueData1', canvas1Colors, canvas1OneSideSectorNum);
