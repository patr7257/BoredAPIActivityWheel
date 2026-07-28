// Generates data/activities.json from the Bored API mirror.
// Run rarely and manually: the dataset is stable and committed.
import { writeFile } from 'node:fs/promises';

const TYPES = [
  'education', 'recreational', 'social', 'charity', 'cooking',
  'relaxation', 'busywork', 'diy', 'music',
];
const BASE = 'https://bored-api.appbrewery.com/filter?type=';

const all = [];
for (const type of TYPES) {
  const res = await fetch(BASE + type);
  if (!res.ok) throw new Error(`${type}: HTTP ${res.status}`);
  const list = await res.json();
  if (!Array.isArray(list)) throw new Error(`${type}: unexpected payload`);
  all.push(...list);
}

const FIELDS = [
  'activity', 'type', 'participants', 'price', 'accessibility',
  'duration', 'kidFriendly', 'link', 'key',
];

const byKey = new Map(
  all.map((a) => [a.key, Object.fromEntries(FIELDS.map((f) => [f, a[f]]))]),
);
const out = [...byKey.values()];
if (out.length < 150) throw new Error(`only ${out.length} activities, refusing to write`);

const target = new URL('../data/activities.json', import.meta.url);
await writeFile(target, JSON.stringify(out, null, 1) + '\n');
console.log(`wrote ${out.length} activities`);
