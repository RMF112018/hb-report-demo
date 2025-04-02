# HB Report

HB Report is a cross-platform desktop application designed for project managers and stakeholders to manage and report on construction project data. It integrates with Procore APIs (planned) for real-time data fetching, uses SQLite for local storage, and provides a modern UI built with React and Ant Design. The app is developed using Electron with plain JavaScript (ESM syntax) for maintainability and modularity.

**Current Version**: v0.0.1 (as of March 19, 2025)

## Project Overview

- **Purpose**: A reporting tool to fetch, manipulate, and generate customizable project reports.
- **Status**: In active development, with a working Electron app, SQLite database, and logging system.
- **Features Implemented**:
    - Electron main process with secure `contextIsolation` and preload script.
  - SQLite database with schema versioning, batch operations, and test data.
  - Comprehensive logging system with Winston and daily rotation.
  - Webpack bundling for main, preload, and renderer processes, transpiling ESM to CommonJS.
  - Error handling with uncaught exception logging and app relaunch on critical failures.
  - Configurable settings via `src/main/config.js` with validation and debug mode.
- **Features Planned**: Procore API integration, CRUD operations, report generation.

## Setup Instructions

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/hb-report.git
    cd hb-report/v0.0.1
    ```
2. **Install Dependencies**
    npm install
3. **Run the App**
    npm start
    **production build (not yet packaged)**
        npm run build
        npx electron dist/main.bundle.js
4. **Database**
    - SQLite database (hb-report.db) is created automatically in the project root on first run.
    - Test data is inserted via src/main/testData.js.
    - Optional: Use --insert-test-data flag to manually trigger test data insertion:
        - npx electron dist/main.bundle.js --insert-test-data
5. **Logs**
    - Logs are written to logs/hb-report-YYYY-MM-DD.log (e.g., hb-report-2025-03-19.log).

## Tech Stack
    Electron: Cross-platform desktop framework (v30.x).
    React: UI renderer (v18.x) with Ant Design (v5.x) for components.
    SQLite3: Local database (v5.x) for project data storage.
    Winston: Logging with daily rotation (winston-daily-rotate-file).
    Webpack: Bundling for main and renderer processes (v5.x).
    Babel: Transpiling ESM and React JSX.
    Node.js: JavaScript runtime (ESM syntax, no TypeScript).

## Directory Structure
hb-report/
├── dist/                   # Built output (main.bundle.js, renderer.bundle.js, index.html)
├── logs/                   # Log files (hb-report-YYYY-MM-DD.log)
├── src/                    # Source code
│   ├── main/               # Electron main process
│   │   ├── config.js       # Centralized app configuration
│   │   ├── db.js           # SQLite initialization and utilities
│   │   ├── eventBus.js     # Event emitter for decoupling logic
│   │   ├── ipc.js          # IPC handlers for main-renderer communication
│   │   ├── logger.js       # Winston logging setup
│   │   ├── main.js         # Entry point with error handling and window setup
│   │   ├── preload.js      # Preload script for secure IPC
│   │   ├── procore.js      # Placeholder for Procore API integration
│   │   ├── settings.js     # Persistent settings loader (future use)
│   │   └── testData.js     # Test data insertion
│   ├── renderer/           # React renderer process
│   │   ├── index.html      # HTML template
│   │   ├── main.js         # Renderer entry point
│   │   ├── App.js          # Root React component
│   │   ├── utils/          # Utilities (e.g., logger.js)
│   │   ├── components/     # Reusable React components (placeholder)
│   │   ├── services/       # Service modules (placeholder)
│   │   └── assets/         # Static assets (placeholder)
├── webpack.config.js       # Webpack configuration
├── .babelrc                # Babel configuration
├── package.json            # Dependencies and scripts
├── .gitignore              # Git ignore (node_modules/, dist/, logs/)
└── README.md               # This file

## Development Details
**Electron Setup**
    - Main Process: src/main/main.js initializes the Electron app, creates the window, and loads the renderer.
    - Preload Script: src/main/preload.js exposes a limited api object for IPC communication (e.g., getProjects, log).
    - Renderer Process: src/renderer/main.js bootstraps a React app with Ant Design, served via Webpack Dev Server in development.
**Database**
    - SQLite: Managed in src/main/db.js with schema versioning (schema_version table) and migrations.
    - Schema: Includes tables like projects, budget, tasks, hb_positions, etc., with foreign key constraints.
    - Operations: Supports upsertEntity, batchUpsert, getProjects, and transaction management (runInTransaction).
    - Test Data: Inserted via src/main/testData.js (e.g., sample projects, positions).
    - Performance: Optimized with WAL mode, 20MB cache, and memory-mapped I/O (256MB).
**Logging**
    - Winston: Configured in src/main/logger.js with daily rotation (hb-report-YYYY-MM-DD.log in logs/).
    - Renderer Logging: Logs are sent via IPC (src/renderer/utils/logger.js) to the main process for file writing.
    - Features: Process context ([main]/[renderer]), stack traces for errors, 14-day retention with compression.
**Known Issues**

## Build Configuration
**Webpack**
    - webpack.config.js (ESM syntax) bundles main, preload, and renderer processes. Externalizes electron and sqlite3 as CommonJS modules, transpiles ESM to CommonJS via Babel.
**Babel**
    - Configured in webpack.config.js with @babel/preset-env targeting current Node.js, ensuring Electron compatibility.
**Notes**
    - Some modules (e.g., main.js) are "not cacheable" due to topLevelAwait and externals, but this doesn’t affect runtime.

### Known Issues
**Build Performance**
    - "Not cacheable" modules slightly slow incremental builds (negligible now, monitor as codebase grows).
**Packaging**
    - Not yet implemented; requires electron-builder setup for production executables.

## Running the App
**Development**
    npm start 
    - launches the app with hot reloading for the renderer and automatic main process rebuilds via nodemon.
**Logs**
    Check logs/hb-report-YYYY-MM-DD.log for runtime details.
**Database**
    Inspect hb-report.db with a SQLite viewer (e.g., DB Browser for SQLite).

## Building for Distribution
**Current**
    npm run build creates production bundles in dist/.
**Future** 
    Add electron-builder or similar to package into executables for Windows, macOS, and Linux.

## Contributing
**Code Style**: Plain JavaScript (ESM), no TypeScript, with inline comments for clarity.
**Maintainability**: Modular structure, clear separation of concerns, and reusable utilities.
**Next Steps**: 
    - Enhance React renderer with CRUD functionality and report generation.
    - Set up electron-builder for production packaging.
    - Optimize Webpack caching if build times increase.

