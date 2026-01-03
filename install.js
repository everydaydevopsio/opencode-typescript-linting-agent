#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const agentName = 'typescript-linting.md';
const sourceFile = path.join(__dirname, 'agent', agentName);

// Determine if this is a global installation
// npm sets npm_config_global=true when installing globally
const isGlobalInstall = process.env.npm_config_global === 'true';

// Determine the target directory based on installation type
let targetDir;
if (isGlobalInstall) {
  // Global install: use ~/.config/opencode/agent
  targetDir = path.join(os.homedir(), '.config', 'opencode', 'agent');
} else {
  // Local install: use .opencode/ in the project directory
  // npm_config_local_prefix points to the project root during npm install
  const projectRoot = process.env.npm_config_local_prefix || process.cwd();
  targetDir = path.join(projectRoot, '.opencode');
}

// Create the directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetFile = path.join(targetDir, agentName);

// Copy the agent file
try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log('TypeScript Linting agent installed successfully!');
  console.log(`  Installed to: ${targetFile}`);
  console.log(`  Installation type: ${isGlobalInstall ? 'global' : 'local'}`);
  console.log('\nUsage:');
  console.log('  Run "opencode" in any TypeScript project');
  console.log('  The typescript-linting subagent will be available');
  console.log(
    '  Primary agents can invoke it automatically for linting setup tasks'
  );
  console.log('\nManual invocation:');
  console.log('  @typescript-linting help me set up linting for this project');
} catch (error) {
  console.error('Failed to install TypeScript Linting agent:', error.message);
  process.exit(1);
}
