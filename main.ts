// bring-the-humans-03 entry for tacinbau — "Your AI agent is bored."
//
// The entry is the TikTok ad itself: an original 24.5s vertical video made
// in-session from make.fun's press pack, posted publicly on TikTok, whose
// full address lives in VIDEO.json. All this program has to do is hand that
// address to the grader, so it copies VIDEO.json from the repository root
// into the output directory. It touches no network, no clock and no files
// outside the repository, so repeated runs write identical bytes.
//
// Node 22, standard library only. Outside the grader's container the two
// directories can be pointed elsewhere for a local check:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Where the repository is mounted, and where the grader reads results.
const repoRoot = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly instead of handing the grader a stale or broken file.
const source = join(repoRoot, 'VIDEO.json');
const payload = JSON.parse(readFileSync(source, 'utf8'));
if (typeof payload !== 'object' || payload === null || typeof payload.url !== 'string') {
  throw new Error('VIDEO.json must be an object with a string "url" field');
}
if (!/^https:\/\/(www\.|m\.)?tiktok\.com\/@[^/]+\/video\/\d+$/.test(payload.url)) {
  throw new Error(`VIDEO.json url is not a TikTok video address: ${payload.url}`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, 'VIDEO.json'));
