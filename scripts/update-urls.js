const fs = require('fs');
const path = require('path');

const OLD_URL = 'https://all-the-tools.netlify.app';
const NEW_URL = 'https://www.allthethings.dev';

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(OLD_URL)) {
    const newContent = content.replace(new RegExp(OLD_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_URL);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let updatedCount = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      updatedCount += walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.html')) {
      if (replaceInFile(filePath)) {
        updatedCount++;
      }
    }
  });

  return updatedCount;
}

const featuresDir = path.join(__dirname, '../src/app/features');
console.log('🔍 Searching for old URLs...\n');
const count = walkDir(featuresDir);
console.log(`\n🎉 Updated ${count} files!`);
