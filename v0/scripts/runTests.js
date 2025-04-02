// scripts/runTests.js
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current date for filename (MMDDYY)
const date = new Date();
const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const dd = String(date.getDate()).padStart(2, '0');
const yy = String(date.getFullYear()).slice(-2);

// Component name (hardcoded for Buyout; could be dynamic with args)
const componentName = 'ForecastingV2';
const logFileName = `test_${componentName}_${mm}${dd}${yy}.log`;
const __dirname = dirname(fileURLToPath(import.meta.url));
const logDir = join(__dirname, '../bin/logs');
const logPath = join(logDir, logFileName);

// Ensure bin/logs exists
try {
  mkdirSync(logDir, { recursive: true });
} catch (err) {
  if (err.code !== 'EEXIST') throw err;
}

// Run Jest and capture output
try {
  const output = execSync('npx jest --verbose', { encoding: 'utf8', stdio: 'pipe' });
  writeFileSync(logPath, output);
  console.log(`Test results saved to ${logPath}`);
  console.log(output); // Still display in terminal
} catch (error) {
  const errorOutput = error.output ? error.output.join('') : error.message;
  writeFileSync(logPath, errorOutput);
  console.error(`Tests failed; results saved to ${logPath}`);
  console.error(errorOutput);
  process.exit(1); // Exit with failure code
}