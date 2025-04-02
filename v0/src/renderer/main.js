// src/renderer/main.js
// Entry point for the renderer process, rendering the React app into the DOM
// This file is bundled by Webpack as specified in webpack.config.js
// Reference: https://react.dev/reference/react-dom/client/createRoot

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles/global.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);