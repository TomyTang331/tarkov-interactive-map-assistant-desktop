const fs = require('fs');
const path = require('path');
const refPath = path.join(__dirname, '../tarkov-tilty-frontend-opensource/src/data/interactive_maps.ts');
const content = fs.readFileSync(refPath, 'utf8');
const re = /id:\s*'([^']+)',\s*name:\s*'([^']*(?:\\'[^']*)*)'/g;
const map = {};
let m;
while ((m = re.exec(content)) !== null) {
  const id = m[1];
  const name = m[2].replace(/\\'/g, "'");
  if (!map[id]) map[id] = name;
}
const outPath = path.join(__dirname, '../src/data/extract_names_zh.json');
fs.writeFileSync(outPath, JSON.stringify(map, null, 2), 'utf8');
console.log('Wrote', outPath, 'with', Object.keys(map).length, 'entries');
