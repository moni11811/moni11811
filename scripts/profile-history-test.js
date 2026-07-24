const assert = require('assert');
const { execFileSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
let count = 0;
try {
  count = Number(execFileSync('git', ['rev-list', '--count', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim());
} catch {
  count = 0;
}

assert.strictEqual(count, 1, 'public profile repository must contain exactly one sanitized root commit');
const parents = execFileSync('git', ['rev-list', '--parents', '--max-count=1', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim().split(/\s+/);
assert.strictEqual(parents.length, 1, 'sanitized profile commit must have no parent');

console.log('PASS: sanitized single-root profile history');
