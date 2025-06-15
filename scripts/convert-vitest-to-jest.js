const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all test files
const testFiles = glob.sync('**/*.{test,spec}.{ts,tsx}', {
  ignore: ['node_modules/**', 'dist/**', 'coverage/**'],
});

const replaceVitestImports = (content) => {
  // Replace Vitest imports with Jest imports
  content = content.replace(
    /import\s*{\s*([^}]+)\s*}\s*from\s*['"]vitest['"];?/g,
    "import { $1 } from '@jest/globals';"
  );

  // Replace vi with jest
  content = content.replace(/\bvi\./g, 'jest.');
  content = content.replace(/\s+vi\b/g, ' jest');
  content = content.replace(/\(\s*vi\b/g, '(jest');
  content = content.replace(/{\s*vi\b/g, '{jest');
  content = content.replace(/import\s*{\s*vi\s*}/g, 'import { jest }');

  // Replace Mock type from Vitest
  content = content.replace(/Mock(\s*)</g, 'jest.Mock$1<');
  content = content.replace(/type\s*Mock\s*=/g, 'type Mock =');

  return content;
};

// Process each test file
testFiles.forEach((file) => {
  const filePath = path.resolve(file);
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = replaceVitestImports(content);
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Converted ${file}`);
});
