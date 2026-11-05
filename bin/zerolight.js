#!/usr/bin/env node

/**
 * ZeroLight CLI
 * The official CLI for the ZeroLight Fluid Input Atoms Design System.
 * Usage:
 *   npx zerolight init
 *   npx zerolight add [component]
 *   npx zerolight list
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const command = args[0] || 'help';

const REGISTRY = {
  input: {
    name: 'FluidStandardInput',
    description: 'Single-line tactile text input with responsive clear button',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
  },
  select: {
    name: 'FluidSearchableSelect',
    description: 'Fluid popover dropdown with internal filter, sliding hover backplate, and stagger reveals',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
  },
  'multi-select': {
    name: 'FluidMultiSelect',
    description: 'Dynamic corner-tag deck with inline chip remove, overflow badge, and animated checkmarks',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
  },
  studio: {
    name: 'FluidVisualStudioDock',
    description: 'Interactive visual studio dock to calibrate density, radii, and spring physics in real time',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
  },
  'poc-form': {
    name: 'CustomerOnboardingForm',
    description: 'Complete pre-assembled SaaS PoC form template utilizing all ZeroLight atoms',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
  },
};

const ZEROLIGHT_CSS_SNIPPET = `
/* ZeroLight Fluid Input Atoms Studio Animations */
.menu-transition {
  transition: opacity 140ms cubic-bezier(0.4, 0, 1, 1),
              transform 140ms cubic-bezier(0.4, 0, 1, 1);
  transform-origin: top center;
}
.menu-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 280ms cubic-bezier(0.175, 0.885, 0.32, 1.25);
}
.menu-hidden {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
  pointer-events: none;
}

.tactile-press {
  transition: transform 120ms cubic-bezier(0.2, 0, 0, 1);
}
.tactile-press:active {
  transform: scale(0.985);
}

.sliding-hover-indicator {
  position: absolute;
  left: 6px;
  right: 6px;
  height: 40px;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  opacity: 0;
  transform: translateY(0);
  transition: transform 160ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 120ms ease-out,
              border-radius 120ms ease-out;
  z-index: 1;
}

.stagger-item {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 220ms cubic-bezier(0.175, 0.885, 0.32, 1.2);
  position: relative;
  z-index: 2;
}
.menu-visible .stagger-item {
  opacity: 1;
  transform: translateY(0);
}
.menu-visible .stagger-item:nth-child(1) { transition-delay: 20ms; }
.menu-visible .stagger-item:nth-child(2) { transition-delay: 45ms; }
.menu-visible .stagger-item:nth-child(3) { transition-delay: 70ms; }
.menu-visible .stagger-item:nth-child(4) { transition-delay: 95ms; }

.check-path {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  transition: stroke-dashoffset 180ms cubic-bezier(0.16, 1, 0.3, 1);
}
.checked .check-path,
[aria-selected="true"] .check-path {
  stroke-dashoffset: 0;
}

@keyframes chipPop {
  0% { opacity: 0; transform: scale(0.85) translateX(-4px); }
  100% { opacity: 1; transform: scale(1) translateX(0); }
}

.chip-animate {
  animation: chipPop 200ms cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
}
`;

function init() {
  console.log('\x1b[36m%s\x1b[0m', '⚡ Initializing ZeroLight Design System in current project...');

  // 1. Locate css file (src/index.css or src/globals.css or app/globals.css)
  const candidateCss = [
    'src/index.css',
    'src/globals.css',
    'src/app/globals.css',
    'app/globals.css',
    'styles/globals.css',
  ];

  let targetCss = candidateCss.find((f) => fs.existsSync(path.resolve(process.cwd(), f)));

  if (targetCss) {
    const fullPath = path.resolve(process.cwd(), targetCss);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('ZeroLight Fluid Input Atoms')) {
      fs.appendFileSync(fullPath, ZEROLIGHT_CSS_SNIPPET);
      console.log('\x1b[32m%s\x1b[0m', `✓ Injected ZeroLight spring physics & animations into ${targetCss}`);
    } else {
      console.log('\x1b[33m%s\x1b[0m', `ℹ ZeroLight animations already present in ${targetCss}`);
    }
  } else {
    console.log('\x1b[33m%s\x1b[0m', 'ℹ Could not find standard globals.css/index.css. Please paste animations manually from README.');
  }

  // 2. Create target directory
  const targetDir = path.resolve(process.cwd(), 'src/components/zerolight');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log('\x1b[32m%s\x1b[0m', `✓ Created components directory: src/components/zerolight`);
  }

  console.log('\x1b[32m%s\x1b[0m', '✓ ZeroLight initialized successfully!');
  console.log('Run \x1b[36mnpx zerolight add [component]\x1b[0m to add inputs to your project.\n');
}

function list() {
  console.log('\x1b[36m%s\x1b[0m', '\nZeroLight Available Primitives & PoC Blocks:\n');
  Object.entries(REGISTRY).forEach(([key, info]) => {
    console.log(`  \x1b[32m${key.padEnd(16)}\x1b[0m \x1b[1m${info.name}\x1b[0m`);
    console.log(`  ${''.padEnd(16)} \x1b[90m${info.description}\x1b[0m\n`);
  });
  console.log('Add any component using: \x1b[36mnpx zerolight add [name]\x1b[0m\n');
}

function add(componentKey) {
  if (!componentKey || !REGISTRY[componentKey]) {
    console.error(`\x1b[31mError: Unknown component "${componentKey}".\x1b[0m`);
    console.log('Available components: ' + Object.keys(REGISTRY).join(', '));
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), 'src/components/zerolight');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log('\x1b[36m%s\x1b[0m', `Adding ${REGISTRY[componentKey].name} to your project...`);
  console.log('\x1b[32m%s\x1b[0m', `✓ Added component: src/components/zerolight/${REGISTRY[componentKey].name}.tsx`);
  console.log(`\nImport in your code:`);
  console.log(`\x1b[36mimport { ${REGISTRY[componentKey].name} } from '@/components/zerolight/${REGISTRY[componentKey].name}';\x1b[0m\n`);
}

function printHelp() {
  console.log(`
ZeroLight Design System CLI

Usage:
  npx zerolight init             Initialize ZeroLight styles and folders
  npx zerolight list             List available components & PoC blocks
  npx zerolight add [component]  Add an atomic component to src/components/zerolight/

Components:
  input                          FluidStandardInput (Single-line tactile input)
  select                         FluidSearchableSelect (Popover with live filter & sliding backplate)
  multi-select                   FluidMultiSelect (Dynamic corner-tag deck)
  studio                         FluidVisualStudioDock (Visual calibration dock)
  poc-form                       CustomerOnboardingForm (Full SaaS PoC template)

Repository:
  https://github.com/zerorapid/zerolight
`);
}

// Router
switch (command) {
  case 'init':
    init();
    break;
  case 'list':
  case 'ls':
    list();
    break;
  case 'add':
    add(args[1]);
    break;
  case 'help':
  case '--help':
  case '-h':
  default:
    printHelp();
    break;
}
