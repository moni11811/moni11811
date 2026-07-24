const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const forbiddenHashes = new Set([
  '33c594e4e36529842cb1344043ec59e9f4d026466fd7ba0112a635fbe30baf3e',
  'f6b6407632158ebdc802ed898b47e55bf89f61895b50bd8241769c9ee9d9a533',
  '408c7c5887a0f3905767754f424989b0089c14ac502d7f851d11b31ea2d1baa6',
  'c1571777a9c84bccb3c9c67a1386c675d07c418552bf61bc7fb61cb37fcf3659',
  'a8224471df979289d000fbcf34072900e579bb285a0f66189db869a1f559fb6f',
]);

const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');
const files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean);

for (const relative of files) {
  const words = fs.readFileSync(path.join(root, relative), 'utf8')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  for (let start = 0; start < words.length; start += 1) {
    for (let length = 1; length <= 4 && start + length <= words.length; length += 1) {
      const candidate = words.slice(start, start + length).join(' ');
      assert.ok(!forbiddenHashes.has(digest(candidate)), `private identity data found in tracked file: ${relative}`);
    }
  }
}

console.log('PASS: repository-wide private identity denylist');
