const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const archiver = require('archiver');

function createProjectZip() {
    const output = createWriteStream('crop-yield-prediction-app.zip');
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    // Files and directories to exclude
    const excludePatterns = [
        'node_modules',
        '.git',
        '.replit',
        'tmp',
        '.vite',
        'dist',
        '.next',
        'coverage',
        '__pycache__',
        'create_zip.js',
        'create_zip.py',
        'crop-yield-prediction-app.zip'
    ];

    output.on('close', function() {
        console.log(`Successfully created crop-yield-prediction-app.zip`);
        console.log(`Total bytes: ${archive.pointer()}`);
        console.log('The zip file is ready for download!');
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.pipe(output);

    // Add files to the archive
    function addDirectory(dirPath, zipPath = '') {
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const zipItemPath = path.join(zipPath, item);
            const stats = fs.statSync(itemPath);
            
            // Skip excluded patterns
            if (excludePatterns.some(pattern => item.includes(pattern) || itemPath.includes(pattern))) {
                return;
            }
            
            if (stats.isDirectory()) {
                addDirectory(itemPath, zipItemPath);
            } else {
                archive.file(itemPath, { name: zipItemPath });
                console.log(`Added: ${zipItemPath}`);
            }
        });
    }

    addDirectory('.');
    archive.finalize();
}

// Check if archiver is available, if not, use a simpler approach
try {
    require.resolve('archiver');
    createProjectZip();
} catch (err) {
    console.error('archiver module not found. Using alternative method...');
    
    // Fallback method using only built-in modules
    const { execSync } = require('child_process');
    
    try {
        // Create a simple text file listing instead
        const files = [];
        
        function collectFiles(dirPath, basePath = '') {
            const items = fs.readdirSync(dirPath);
            
            items.forEach(item => {
                const itemPath = path.join(dirPath, item);
                const relativePath = path.join(basePath, item);
                const stats = fs.statSync(itemPath);
                
                // Skip excluded patterns
                const excludePatterns = ['node_modules', '.git', 'tmp', '.vite', 'dist'];
                if (excludePatterns.some(pattern => item.includes(pattern) || itemPath.includes(pattern))) {
                    return;
                }
                
                if (stats.isDirectory()) {
                    collectFiles(itemPath, relativePath);
                } else {
                    files.push(relativePath);
                }
            });
        }
        
        collectFiles('.');
        
        // Create a project structure file
        fs.writeFileSync('project-files-list.txt', 
            'Crop Yield Prediction App - File Structure\n' +
            '==========================================\n\n' +
            files.join('\n') + 
            '\n\nTotal files: ' + files.length);
        
        console.log('Created project-files-list.txt with the file structure.');
        console.log('Since zip creation tools are not available, please manually copy the project files.');
        console.log(`Found ${files.length} files in the project.`);
        
    } catch (fallbackErr) {
        console.error('Fallback method failed:', fallbackErr.message);
    }
}