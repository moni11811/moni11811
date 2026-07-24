const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const readmePath = path.join(root, 'README.md');
assert.ok(fs.existsSync(readmePath), 'README.md must exist');

const readme = fs.readFileSync(readmePath, 'utf8');
assert.ok(readme.length >= 900, 'profile README must contain meaningful substance');
assert.ok(readme.length <= 6000, 'profile README must stay concise');

for (const heading of ['About me', "Builder's lab", 'How I work']) {
  assert.match(readme, new RegExp(`## ${heading}`, 'i'), `missing ${heading} section`);
}

for (const identityFact of ['Edmon Abdul Nur', 'IT Support Specialist', 'cybersecurity', 'technical writing']) {
  assert.match(readme, new RegExp(identityFact, 'i'), `missing representative identity fact: ${identityFact}`);
}

const about = readme.match(/## About me\s+([\s\S]*?)\s+## Builder's lab/i)?.[1] ?? '';
assert.ok(about.length > 100, 'About me must say something meaningful');
assert.ok(about.length <= 700, 'About me must stay human and concise, not become a resume dump');
assert.doesNotMatch(about, /^\s*-/m, 'About me must not be a corporate bullet list');
assert.doesNotMatch(readme, /## (?:Professional focus|Career arc)/i, 'remove resume-style sections');
assert.doesNotMatch(readme, /My strengths sit at the intersection|I bring more than|Technology matters\. So do/i, 'remove corporate resume phrasing');

assert.match(readme, /Windows.*macOS|macOS.*Windows/is, 'cross-platform systems experience must be visible');
assert.match(readme, /people|end-user|teams|colleagues/i, 'profile must describe the people served, not only technology');
assert.doesNotMatch(readme, /Apple-platform builder/i, 'a repository theme must not replace professional identity');
assert.doesNotMatch(readme, /linkedin\.com/i, 'do not cross-link personal profiles without explicit publication approval');

for (const repository of ['Touch-Up', 'codex-hass-5.6', 'bbkb-community.github.io', 'Panda_Breath_HA']) {
  assert.match(readme, new RegExp(`https://github\\.com/moni11811/${repository.replaceAll('.', '\\.')}`, 'i'), `missing public project: ${repository}`);
}

assert.match(readme, /fork|workbench|adaptation/i, 'fork-based work must be identified honestly');
assert.doesNotMatch(readme, /ClosedDexter|Zombie Nation|OMI4META|CISSP/i, 'private project names must not leak');
assert.doesNotMatch(readme, /github-readme-stats|komarev|shields\.io/i, 'avoid noisy or tracking-heavy badge farms');
assert.doesNotMatch(readme, /href=["'](?:javascript:|http:)/i, 'profile links must use safe HTTPS URLs');

const links = [...readme.matchAll(/https:\/\/[^\s)"'<>]+/g)].map((match) => match[0]);
assert.ok(new Set(links).size >= 6, 'profile must contain useful public links');

console.log('PASS: public profile README quality contract');
