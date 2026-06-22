const fs = require('fs');
const path = require('path');

const root = __dirname;
const frontendPath = path.join(root, 'frontend');
const backendPath = path.join(root, 'backend');

// Create frontend and backend directories
if (!fs.existsSync(frontendPath)) {
    fs.mkdirSync(frontendPath);
}
if (!fs.existsSync(backendPath)) {
    fs.mkdirSync(backendPath);
}

// Files/folders to keep in root (do not move)
const keepInRoot = [
    '.git',
    'AGENTS.md',
    'CLAUDE.md',
    'README.md',
    'frontend',
    'backend',
    'move.js'
];

// Read all items in the root directory
const items = fs.readdirSync(root);

for (const item of items) {
    if (!keepInRoot.includes(item)) {
        const oldPath = path.join(root, item);
        const newPath = path.join(frontendPath, item);
        try {
            fs.renameSync(oldPath, newPath);
            console.log(`Moved ${item} to frontend/`);
        } catch (err) {
            console.error(`Error moving ${item}:`, err.message);
        }
    }
}
console.log("Restructuring complete.");
