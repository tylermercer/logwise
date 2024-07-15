const fs = require('fs');
const path = require('path');

const inputSvgFilePath = path.join(__dirname, './static/assets/favicon-raw.svg');
const outputSvgFilePath = path.join(__dirname, './static/assets/favicon.svg');

function getAccentColor() {
    const scssFilePath = path.join(__dirname, './src/styles/theme.scss');
    const scssContent = fs.readFileSync(scssFilePath, 'utf8');
    const colorMatch = scssContent.match(/\$accentColor:\s*'([^']+)';/);
    if (colorMatch && colorMatch[1]) {
        return colorMatch[1];
    } else {
        throw new Error('Accent color not found in theme file');
    }
}

// Function to update the SVG file with the accent color
function updateSvgFile(inputSvgFile, outputSvgFile, accentColor) {
    const svgContent = fs.readFileSync(inputSvgFile, 'utf8');
    const updatedSvgContent = svgContent.replace(/#FF00FF/g, accentColor);
    fs.writeFileSync(outputSvgFile, updatedSvgContent, 'utf8');
    console.log(`Theme color interpolated into Favicon SVGs`);
}

try {
    const accentColor = getAccentColor();
    updateSvgFile(inputSvgFilePath, outputSvgFilePath, accentColor);
} catch (error) {
    console.error(error.message);
}
