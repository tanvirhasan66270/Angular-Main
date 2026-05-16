const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/*.html');
let buttonsWithoutAction = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // simple regex to find button opening tags
  const buttonRegex = /<button[^>]*>/g;
  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const btn = match[0];
    if (!btn.includes('(click)') && !btn.includes('routerLink') && !btn.includes('type="submit"') && !btn.includes('data-bs-toggle') && !btn.includes('data-bs-dismiss')) {
      buttonsWithoutAction.push({ file, btn });
    }
  }
});

console.log(`Found ${buttonsWithoutAction.length} buttons without clear actions.`);
buttonsWithoutAction.forEach(b => console.log(`${b.file}: ${b.btn}`));
