// Get the canvas element and its context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Circle parameters
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 180;

// Function to get color based on angle around the circle
function getColorFromAngle(angle) {
    // Normalize angle to 0-1 range (0 at top, going clockwise)
    let normalizedAngle = angle / (Math.PI * 2);
    
    // Adjust to start from the top (270 degrees in standard angle system)
    normalizedAngle = (normalizedAngle + 0.75) % 1;
    
    // Correct vertical flip logic
    if (normalizedAngle < 0.5) {
        // Top half (0-0.5) becomes bottom half (0.5-1)
        normalizedAngle = 0.5 + normalizedAngle;
    } else {
        // Bottom half (0.5-1) becomes top half (0-0.5)
        normalizedAngle = 1.5 - normalizedAngle;
    }
    
    // Define color transitions that repeat twice around the circle
    let colorPosition;
    
    // First half of the circle
    if (normalizedAngle < 0.5) {
        // Map 0-0.5 to 0-1 (top-left-bottom)
        colorPosition = normalizedAngle * 2;
    } 
    // Second half of the circle
    else {
        // Map 0.5-1 to 1-0 (bottom-right-top)
        colorPosition = 2 - (normalizedAngle * 2);
    }
    
    // Define the color stops
    const colorStops = [
        { pos: 0, r: 255, g: 255, b: 0 },     // Bright yellow (top and bottom)
        { pos: 0.44, r: 255, g: 255, b: 200 }, // Light yellow/cream (transition)
        { pos: 0.5, r: 255, g: 240, b: 200 }, // Light yellow/cream (transition)
        { pos: 0.7, r: 120, g: 120, b: 255 }, // Light blue (transition)
        { pos: 0.95, r: 50, g: 50, b: 140 }      // Dark blue (sides)
    ];
    
    // Find the two color stops we're between
    let i = 0;
    while (i < colorStops.length - 1 && colorPosition > colorStops[i + 1].pos) {
        i++;
    }
    
    // If we're at or beyond the last stop, use the last color
    if (i >= colorStops.length - 1) {
        return `rgb(${colorStops[colorStops.length-1].r}, ${colorStops[colorStops.length-1].g}, ${colorStops[colorStops.length-1].b})`;
    }
    
    // Interpolate between the two color stops
    const stop1 = colorStops[i];
    const stop2 = colorStops[i + 1];
    
    // Calculate how far between the two stops we are (0 to 1)
    const t = (colorPosition - stop1.pos) / (stop2.pos - stop1.pos);
    
    // Linear interpolation of RGB values
    const r = Math.round(stop1.r + t * (stop2.r - stop1.r));
    const g = Math.round(stop1.g + t * (stop2.g - stop1.g));
    const b = Math.round(stop1.b + t * (stop2.b - stop1.b));
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Draw the circle with a radial gradient
function drawCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create the gradient
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    // Fill the imageData with our gradient
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            // Calculate distance and angle from center
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Skip pixels outside the circle
            if (distance > radius) continue;
            
            // Calculate angle (in radians)
            const angle = Math.atan2(dy, dx);
            
            // Get color based on angle
            const color = getColorFromAngle(angle);
            
            // Parse the RGB string
            const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            
            // Set pixel data
            const pixelIndex = (y * canvas.width + x) * 4;
            data[pixelIndex] = r;     // Red
            data[pixelIndex + 1] = g; // Green
            data[pixelIndex + 2] = b; // Blue
            data[pixelIndex + 3] = 255; // Alpha (fully opaque)
        }
    }
    
    // Put the image data on the canvas
    ctx.putImageData(imageData, 0, 0);
    
    // Draw the circle outline for reference
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Call the function to draw the circle
drawCircle();
