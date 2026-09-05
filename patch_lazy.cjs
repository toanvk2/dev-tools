const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard React import to include Suspense and lazy
code = code.replace("import React, { useMemo } from 'react';", "import React, { useMemo, Suspense, lazy } from 'react';");

// Replace all page imports with lazy imports
const standardImports = `
import Home from './pages/Home';
import JsonFormatter from './pages/JsonFormatter';
import TextEncoder from './pages/TextEncoder';
import JwtParser from './pages/JwtParser';
import CodeGenerator from './pages/CodeGenerator';
import DiffChecker from './pages/DiffChecker';
import HashGenerator from './pages/HashGenerator';
import TimestampConverter from './pages/TimestampConverter';
import ColorConverter from './pages/ColorConverter';
import CronParser from './pages/CronParser';
import RandomGenerator from './pages/RandomGenerator';
`;

const lazyImports = `
const Home = lazy(() => import('./pages/Home'));
const JsonFormatter = lazy(() => import('./pages/JsonFormatter'));
const TextEncoder = lazy(() => import('./pages/TextEncoder'));
const JwtParser = lazy(() => import('./pages/JwtParser'));
const CodeGenerator = lazy(() => import('./pages/CodeGenerator'));
const DiffChecker = lazy(() => import('./pages/DiffChecker'));
const HashGenerator = lazy(() => import('./pages/HashGenerator'));
const TimestampConverter = lazy(() => import('./pages/TimestampConverter'));
const ColorConverter = lazy(() => import('./pages/ColorConverter'));
const CronParser = lazy(() => import('./pages/CronParser'));
const RandomGenerator = lazy(() => import('./pages/RandomGenerator'));
`;

// It's safer to use regex to replace these imports since the spacing might be tricky
code = code.replace(/import Home from '.\/pages\/Home';[\s\S]+?import RandomGenerator from '.\/pages\/RandomGenerator';/, lazyImports.trim());

// Add Suspense around Routes
const routesRegex = /<Routes>[\s\S]+?<\/Routes>/;
const routesMatch = code.match(routesRegex)[0];
const suspendedRoutes = `
            <Suspense fallback={<div style={{ padding: 50, textAlign: 'center', fontSize: 16 }}>Đang tải công cụ... (Loading)</div>}>
              ${routesMatch}
            </Suspense>
`;
code = code.replace(routesRegex, suspendedRoutes.trim());

fs.writeFileSync('src/App.tsx', code);
