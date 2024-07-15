const fs = require('fs');
const path = require('path');

const inputSvgFilePath = path.join(__dirname, './static/assets/favicon-raw.svg');
const inputManifestFilePath = path.join(__dirname, './static/assets/site-raw.webmanifest');
const outputSvgFilePath = path.join(__dirname, './static/assets/favicon.svg');
const outputManifestFilePath = path.join(__dirname, './static/assets/site.webmanifest');

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
function updateFile(inputFile, outputFile, accentColor) {
    const content = fs.readFileSync(inputFile, 'utf8');
    const updatedContent = content.replace(/#FF00FF/g, accentColor);
    fs.writeFileSync(outputFile, updatedContent, 'utf8');
    console.log(`Theme color interpolated into ${inputFile}`);
}

try {
    const accentColor = getAccentColor();
    updateFile(inputSvgFilePath, outputSvgFilePath, accentColor);
    updateFile(inputManifestFilePath, outputManifestFilePath, accentColor);
} catch (error) {
    console.error(error.message);
}
