// Entry for make.fun bounty ai-excited-01 ("Make the AI judge excited").
// Copies the single entry image that sits beside this program into the
// grader's output directory.
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const image = join(here, 'entry.png');

// Competition cap: one image, at most 1 MiB.
const CAP_BYTES = 1048576;

let payload: Buffer;
try {
  const info = statSync(image);
  if (info.size > CAP_BYTES) {
    console.error(
      `refusing to enter: entry.png is ${info.size} bytes, above the ${CAP_BYTES}-byte cap`
    );
    process.exit(1);
  }
  payload = readFileSync(image);
} catch {
  console.error(
    `refusing to enter: entry.png must sit beside main.ts (${image}) and be readable`
  );
  process.exit(1);
}

const leadHex = payload.subarray(0, 2).toString('hex');
console.log(`entry.png is ${payload.length} bytes, leading bytes ${leadHex}`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'entry.png');
copyFileSync(image, dest);

console.log(
  `copied ${payload.length} bytes (leading bytes ${leadHex}) to ${dest}`
);
