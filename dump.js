#!/usr/bin/env node

/**
 * НАСТРОЙКА: какие папки собирать
 * Пути указываются относительно этого файла (корня монорепы).
 */
const TARGET_DIRS = [
  // Примеры:
  // 'packages/my-lib',
  // 'apps/web',
  'src'
];

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Корень репо = папка, где лежит этот скрипт
const root = __dirname;

// Что игнорировать
const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.next',
  '.idea',
  '.vscode',
  '.husky',
  '.cache'
]);

const IGNORE_FILES = new Set([
  '.DS_Store',
  'yarn.lock',
  'package-lock.json',
  'pnpm-lock.yaml'
]);

function getLangByExt(file) {
  const ext = path.extname(file).toLowerCase();
  switch (ext) {
    case '.js': return 'js';
    case '.ts': return 'ts';
    case '.jsx': return 'jsx';
    case '.tsx': return 'tsx';
    case '.json': return 'json';
    case '.md': return 'md';
    case '.yml':
    case '.yaml': return 'yaml';
    case '.css': return 'css';
    case '.scss': return 'scss';
    case '.html': return 'html';
    default: return ''; // просто ``` без указания языка
  }
}

function *walk(startDir) {
  const entries = fs.readdirSync(startDir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(startDir, entry.name);
    const relFromRoot = path.relative(root, full);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      yield *walk(full);
    } else if (entry.isFile()) {
      if (IGNORE_FILES.has(entry.name)) continue;
      yield { full, rel: relFromRoot };
    }
  }
}

/**
 * Копирование в буфер обмена без сторонних зависимостей.
 * macOS: pbcopy
 * Windows: clip
 * Linux: xclip / xsel (если установлены)
 */
function copyToClipboard(text) {
  const platform = process.platform;

  if (platform === 'darwin') {
    const proc = spawnSync('pbcopy', [], { input: text });
    return !proc.error && proc.status === 0;
  }

  if (platform === 'win32') {
    const proc = spawnSync('clip', [], { input: text, shell: true });
    return !proc.error && proc.status === 0;
  }

  // Linux / прочие Unix
  let proc = spawnSync('xclip', ['-selection', 'clipboard'], { input: text });
  if (!proc.error && proc.status === 0) return true;

  proc = spawnSync('xsel', ['--clipboard', '--input'], { input: text });
  if (!proc.error && proc.status === 0) return true;

  return false;
}

// --- Основная логика ---

if (!Array.isArray(TARGET_DIRS) || TARGET_DIRS.length === 0) {
  console.error('❌ В TARGET_DIRS не указано ни одной папки. Отредактируй скрипт.');
  process.exit(1);
}

let parts = [];
let hadFiles = false;

for (const relDir of TARGET_DIRS) {
  const absDir = path.resolve(root, relDir);

  if (!fs.existsSync(absDir) || !fs.statSync(absDir).isDirectory()) {
    console.error(`⚠️ Папка "${relDir}" не найдена или это не директория, пропускаю.`);
    continue;
  }

  for (const file of walk(absDir)) {
    hadFiles = true;
    const code = fs.readFileSync(file.full, 'utf8');
    const lang = getLangByExt(file.rel);

    // Разделитель файла
    parts.push(`=== file: ${file.rel} ===`);
    // Кодовый блок (ломаем вложенные ``` чтобы не порвать разметку)
    parts.push('```' + lang);
    parts.push(code.replace(/```/g, '``` '));
    parts.push('```');
    parts.push(''); // пустая строка между файлами
  }
}

if (!hadFiles) {
  console.error('❌ Не найдено ни одного файла в указанных папках.');
  process.exit(1);
}

const output = parts.join('\n');

// Пытаемся скопировать в буфер обмена
const ok = copyToClipboard(output);

if (ok) {
  console.log(`✅ Содержимое (${output.length} символов) скопировано в буфер обмена.`);
} else {
  console.error('⚠️ Не удалось скопировать в буфер обмена (нет pbcopy/clip/xclip/xsel?).');
  console.error('Сейчас выведу текст в stdout — можно скопировать вручную из терминала.\n');
  process.stdout.write(output);
}
