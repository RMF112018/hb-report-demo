// bin/grokPrompt.js
// Generates prompt files for HB Report, capturing project structure and key files for a frontend-only demo application
// Usage: node bin/grokPrompt.js . <directory_path> [--prompt <prompt_name>] [--all-files] [<additional_file1> <additional_file2> ...]
// Output: Up to three .txt files in app/prompts/ - {date}_HB-Report_prompt.txt (main), {date}_HB-Report_additional_prompt.txt (additional files), {date}_HB-Report_all_files_prompt.txt (all files if --all-files flag is used)
// Reference: https://nodejs.org/docs/latest-v23.x/api/fs.html, https://www.npmjs.com/package/dree
import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { scan } from 'dree';

// Configuration
const configFilePath = './bin/promptConfig.js';
const outputDir = 'bin/prompts';
const ignoredDirs = ['.next', 'node_modules', '.git', 'public', 'bin', 'bin/prompts'];
const ignoredFiles = ['.env', 'package-lock.json', '.gitignore', 'pnpm-lock.yaml', 'vercel.json'];

// Generate timestamp for filenames (e.g., 20250619)
const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const mainOutputFile = join(outputDir, `${timestamp}_HB-Report_prompt.txt`);
const additionalOutputFile = join(outputDir, `${timestamp}_HB-Report_additional_prompt.txt`);
const allFilesOutputFile = join(outputDir, `${timestamp}_HB-Report_all_files_prompt.txt`);

// Load and process config
async function loadConfig(directoryPath) {
  const configPath = resolve(directoryPath, configFilePath);
  try {
    const config = await import(`file://${configPath.replace(/\\/g, '/')}`);
    return config.default;
  } catch (error) {
    console.error(`Failed to load ${configFilePath}: ${error.message}`);
    return { prompts: {}, primary_files: [], additional_files: [] };
  }
}

// Generate directory tree manually from dree's scan result
async function generateDirectoryTree(directoryPath, filterFiles = null) {
  const tree = scan(directoryPath, {
    exclude: ignoredDirs.map(dir => new RegExp(dir)),
    symbolicLinks: false,
    followLinks: false,
    depth: undefined,
    showHidden: false
  });

  function buildTree(node, prefix = '', filter = null) {
    let result = '';
    if (!node) return result;

    // Include the node if it's a directory or a file in the filter list
    if (node.type === 'directory' || (node.type === 'file' && (!filter || filter.includes(node.relativePath)))) {
      result += `${prefix}${node.name}${node.type === 'directory' ? '/' : ''}\n`;
    }

    if (node.children && node.type === 'directory') {
      const sortedChildren = node.children.sort((a, b) => a.name.localeCompare(b.name));
      sortedChildren.forEach((child, index) => {
        const isLast = index === sortedChildren.length - 1;
        if (child.type === 'directory' || (child.type === 'file' && (!filter || filter.includes(child.relativePath)))) {
          result += buildTree(child, prefix + (isLast ? '└── ' : '├── '), filter);
        } else if (child.children) {
          // Include directories that might have filtered files in their subtree
          const subtree = buildTree(child, prefix + (isLast ? '└── ' : '├── '), filter);
          if (subtree) result += subtree;
        }
      });
    }
    return result;
  }

  return buildTree(tree, '', filterFiles);
}

// Collect all files recursively, excluding ignored directories and files
async function collectAllFiles(directoryPath) {
  const files = [];
  const tree = scan(directoryPath, {
    exclude: ignoredDirs.map(dir => new RegExp(dir)),
    symbolicLinks: false,
    followLinks: false,
    depth: undefined,
    showHidden: false
  });

  function traverse(node) {
    if (!node) return;
    if (node.type === 'file' && !ignoredFiles.includes(node.name) && !ignoredFiles.includes('/' + node.name)) {
      files.push(node.relativePath);
    }
    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  traverse(tree);
  return files.sort();
}

// Process and write files
async function processFiles(directoryPath, promptName = 'default', additionalFiles = [], processAllFiles = false, mode = 'files') {
  try {
    // Ensure output directory exists
    await fs.mkdir(join(directoryPath, outputDir), { recursive: true });

    // Load config
    const config = await loadConfig(directoryPath);
    const prompts = config.prompts || {};
    const primaryFiles = config.primary_files || [];
    const additionalConfigFiles = config.additional_files || [];

    // Use listMode prompt for list mode, otherwise use specified or default prompt
    const effectivePromptName = mode === 'list' ? 'listMode' : promptName;

    // Get the prompt and split if necessary
    const rawPrompt = prompts[effectivePromptName] || 'Default prompt - no specific prompt defined in config.';
    let mainPrompt = rawPrompt;
    let referencedFilesPrompt = '';
    
    if (mode === 'list' && rawPrompt.includes('### Referenced Files Prompt')) {
      const [firstPart, secondPart] = rawPrompt.split('### Referenced Files Prompt');
      mainPrompt = firstPart.trim();
      referencedFilesPrompt = secondPart.trim();
    }

    // Main prompt file
    const dirTree = await generateDirectoryTree(directoryPath);
    let mainOutput = `${mainPrompt}\n\n### Directory Tree\n${dirTree}\n\n`;

    if (mode === 'list') {
      // Generate filtered tree for referenced files
      const referencedFiles = [...primaryFiles, ...additionalConfigFiles, ...additionalFiles];
      const filteredTree = await generateDirectoryTree(directoryPath, referencedFiles);
      mainOutput += `### Referenced Files Directory Tree\n${referencedFilesPrompt}\n\n${filteredTree}\n\n`;
    } else if (mode === 'files') {
      // Process primary files
      for (const file of primaryFiles) {
        const fullPath = resolve(directoryPath, file);
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          mainOutput += `File: ${file}\n${content}\n\n`;
        } catch (error) {
          mainOutput += `File: ${file}\nError: Could not read file - ${error.message}\n\n`;
        }
      }
    } else {
      console.error(`Invalid mode: ${mode}. Use 'files' or 'list'.`);
      process.exit(1);
    }

    mainOutput += 'Please await further instruction.';
    await fs.writeFile(join(directoryPath, mainOutputFile), mainOutput);
    console.log(`Main prompt written to ${mainOutputFile}`);

    // Additional files (if any, only in 'files' mode)
    const allAdditionalFiles = [...additionalConfigFiles, ...additionalFiles];
    if (allAdditionalFiles.length > 0 && mode === 'files') {
      let additionalOutput = 'When you have completed your review and are prepared to proceed, respond with the single word "Ready".\n\n';
      for (const file of allAdditionalFiles) {
        const fullPath = resolve(directoryPath, file);
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          additionalOutput += `File: ${file}\n${content}\n\n`;
        } catch (error) {
          additionalOutput += `File: ${file}\nError: Could not read file - ${error.message}\n\n`;
        }
      }
      additionalOutput += 'Please await further instruction.';
      await fs.writeFile(join(directoryPath, additionalOutputFile), additionalOutput);
      console.log(`Additional files written to ${additionalOutputFile}`);
    }

    // Process all files if --all-files flag is provided (only in 'files' mode)
    if (processAllFiles && mode === 'files') {
      let allFilesOutput = `${mainPrompt}\n\nThe following are all files in the project, excluding ignored directories and files.\n\n`;
      const allFiles = await collectAllFiles(directoryPath);
      for (const file of allFiles) {
        const fullPath = resolve(directoryPath, file);
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          allFilesOutput += `File: ${file}\n${content}\n\n`;
        } catch (error) {
          allFilesOutput += `File: ${file}\nError: Could not read file - ${error.message}\n\n`;
        }
      }
      allFilesOutput += 'Please await further instruction.';
      await fs.writeFile(join(directoryPath, allFilesOutputFile), allFilesOutput);
      console.log(`All files written to ${allFilesOutputFile}`);
    }
  } catch (error) {
    console.error(`Error processing files: ${error.message}`);
  }
}

// Parse command-line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node bin/grokPrompt.js <directory_path> <mode: files|list> [--prompt <prompt_name>] [--all-files] [<additional_file1> <additional_file2> ...]');
  process.exit(1);
}

const directoryPath = resolve(args[0]);
const mode = args[1] === 'list' ? 'list' : 'files';
let promptName = 'default';
let additionalFiles = [];
let processAllFiles = false;

for (let i = 2; i < args.length; i++) {
  if (args[i] === '--prompt' && i + 1 < args.length) {
    promptName = args[i + 1];
    i++;
  } else if (args[i] === '--all-files') {
    processAllFiles = true;
  } else {
    additionalFiles = args.slice(i);
    break;
  }
}

// Execute the script
processFiles(directoryPath, promptName, additionalFiles, processAllFiles, mode);