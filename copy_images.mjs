import fs from 'fs';
import path from 'path';

const sourceDirs = ['Bar', 'Kuchnia'];
const destDir = path.join('public', 'images', 'menu');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const normalizeFilename = (filename) => {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  
  const normalized = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/ł/g, 'l')
    .replace(/ś/g, 's')
    .replace(/ć/g, 'c')
    .replace(/ń/g, 'n')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z')
    .replace(/ą/g, 'a')
    .replace(/ę/g, 'e')
    .replace(/ó/g, 'o')
    .replace(/,/g, '')
    .replace(/&/g, '')
    .replace(/_{2,}/g, '_')
    .replace(/-{2,}/g, '-');
    
  // special fix for extensions like .JPG to .jpg
  return `${normalized}${ext.toLowerCase()}`;
};

const copiedFiles = [];

sourceDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const srcPath = path.join(dir, file);
      if (fs.statSync(srcPath).isFile()) {
        const newFilename = normalizeFilename(file);
        const destPath = path.join(destDir, newFilename);
        fs.copyFileSync(srcPath, destPath);
        copiedFiles.push({ original: file, new: newFilename, dir });
      }
    });
  }
});

console.log(JSON.stringify(copiedFiles, null, 2));
