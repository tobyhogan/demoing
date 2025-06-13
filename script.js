// Canvas class to handle all drawing and functionality for each canvas
class CircleCanvas {
    constructor(canvasId, dataElementId, colors, numMarkers) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dataElement = document.getElementById(dataElementId);

        // Canvas and circle properties
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = 150;

        // Number of markers (and thus sectors)
        this.numMarkers = numMarkers;
        this.markerAngles = [];
        for (let i = 0; i < this.numMarkers; i++) {
            // Start from top (-PI/2), go clockwise
            this.markerAngles.push(-Math.PI / 2 + i * 2 * Math.PI / this.numMarkers);
        }
        this.dataElement.textContent = this.markerAngles.map(a => a.toFixed(2)).join(',');

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

    calculateMarkerPosition(angle) {
        // Calculate x, y on the circle for a given angle
        return {
            x: this.centerX + this.radius * Math.cos(angle),
            y: this.centerY + this.radius * Math.sin(angle)
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
        this.markerAngles.forEach(angle => {
            const pos = this.calculateMarkerPosition(angle);
            this.drawMarker(pos.x, pos.y);
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
        for (let i = 0; i < this.numMarkers; i++) {
            const angle1 = this.markerAngles[i];
            const angle2 = this.markerAngles[(i + 1) % this.numMarkers];
            const colorIndex = i % this.sectorColors.length;
            this.drawSector(angle1, angle2, this.sectorColors[colorIndex]);
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
    
    // Method to update number of markers (and thus sectors)
    updateNumMarkers(newNumMarkers) {
        this.numMarkers = newNumMarkers;
        this.markerAngles = [];
        for (let i = 0; i < this.numMarkers; i++) {
            this.markerAngles.push(-Math.PI / 2 + i * 2 * Math.PI / this.numMarkers);
        }
        this.dataElement.textContent = this.markerAngles.map(a => a.toFixed(2)).join(',');
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
    yellow1,yellow2, yellow2, yellow3, 
    yellow1,yellow2, yellow2, yellow3, 
    blue3, blue2, blue2, blue1,
    blue3, blue2, blue2, blue1,
    blue1, blue2, blue2, blue3, 
    blue1, blue2, blue2, blue3, 
    yellow3, yellow2, yellow2, yellow1,
    yellow3, yellow2, yellow2, yellow1
    
];

// Different colors for Canvas 2


// Create the canvas instance with number of markers = number of sectors/colors
const canvas1 = new CircleCanvas('circleCanvas1', 'markerYValueData1', canvas1Colors, canvas1Colors.length);

// Example of how to update a specific canvas
// To be used for future functionality:
// canvas1.updateColors(newColorsArray);
// canvas2.updateMarkerPositions(newPositionsArray);
