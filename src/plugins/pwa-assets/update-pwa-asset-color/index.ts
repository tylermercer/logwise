import fs from 'fs';
import path from 'path';

// Define file paths
const inputSvgFilePath = './static/assets-raw/favicon.svg';
const inputManifestFilePath = './static/assets-raw/site.webmanifest';
const outputSvgFilePath = './static/assets/favicon.svg';
const outputManifestFilePath = './static/assets/site.webmanifest';

// Ensure the output directory exists
function ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

// Function to get the accent color from the SCSS file -- KEEP IN SYNC WITH pwa-assets.config.ts
export function getThemeColor() {
    const scssFilePath = './src/styles/theme.scss';
    const scssContent = fs.readFileSync(scssFilePath, 'utf8');
    const colorMatch = scssContent.match(/\$themeColor:\s*(#[A-Fa-f0-9]+);/);
    if (colorMatch && colorMatch[1]) {
        return colorMatch[1];
    } else {
        throw new Error('Theme color not found in theme file');
    }
}

// Function to update the file with the accent color
function updateFile(inputFile: string, outputFile: string, themeColor: string) {
    ensureDirectoryExistence(outputFile);
    const content = fs.readFileSync(inputFile, 'utf8');
    const updatedContent = content.replace(/#FF00FF/g, themeColor);
    fs.writeFileSync(outputFile, updatedContent, 'utf8');
    console.log(`Theme color interpolated into ${inputFile} and saved as ${outputFile}`);
}

export function interpolateThemeColorIntoAssets() {
    try {
        const themeColor = getThemeColor();
        updateFile(inputSvgFilePath, outputSvgFilePath, themeColor);
        updateFile(inputManifestFilePath, outputManifestFilePath, themeColor);
    } catch (error) {
        console.error((error as any)?.message ?? error);
    }
}

