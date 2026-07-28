import { filterActivities, pickCandidates, findByKey } from './logic.js';
import { Wheel } from './wheel.js';

const TYPES = ['education', 'recreational', 'social', 'charity', 'cooking', 'relaxation', 'busywork', 'diy', 'music'];

const activities = await (await fetch('./data/activities.json')).json();
const wheel = new Wheel(document.getElementById('wheel'));

const el = (id) => document.getElementById(id);
const spinBtn = el('spin');
const emptyMsg = el('empty-msg');
const resultBox = el('result');

const state = { participants: 'any', price: 'any', types: [], candidates: [], spinning: false };

function buildTypeChips() {
  const group = document.querySelector('[data-filter="types"]');
  for (const type of TYPES) {
    const b = document.createElement('button');
    b.className = 'chip';
    b.dataset.value = type;
    b.textContent = type;
    group.appendChild(b);
  }
}

function refreshWheel() {
  const pool = filterActivities(activities, state);
  state.candidates = pickCandidates(pool, 8);
  wheel.setItems(state.candidates.map((a) => a.activity));
  const enough = state.candidates.length >= 2;
  spinBtn.disabled = !enough || state.spinning;
  emptyMsg.hidden = pool.length > 0;
}

function showResult(activity) {
  el('result-text').textContent = activity.activity;
  const meta = el('result-meta');
  meta.innerHTML = '';
  const chips = [
    activity.type,
    `${activity.participants} ${activity.participants === 1 ? 'person' : 'people'}`,
    activity.price === 0 ? 'free' : activity.price <= 0.3 ? 'cheap' : 'costs a bit',
    activity.accessibility,
    activity.duration,
    activity.kidFriendly ? 'kid friendly' : 'not for kids',
  ];
  for (const text of chips.filter(Boolean)) {
    const li = document.createElement('li');
    li.textContent = text;
    meta.appendChild(li);
  }
  resultBox.hidden = false;
  resultBox.dataset.key = activity.key;
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function doSpin() {
  if (state.spinning || state.candidates.length < 2) return;
  state.spinning = true;
  spinBtn.disabled = true;
  resultBox.hidden = true;
  const index = await wheel.spin();
  state.spinning = false;
  spinBtn.disabled = state.candidates.length < 2;
  showResult(state.candidates[index]);
}

document.querySelectorAll('.filter-group').forEach((group) => {
  group.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip || state.spinning) return;
    const filter = group.dataset.filter;
    if (filter === 'types') {
      chip.classList.toggle('active');
      state.types = [...group.querySelectorAll('.chip.active')].map((c) => c.dataset.value);
    } else {
      group.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      state[filter] = chip.dataset.value;
    }
    refreshWheel();
  });
});

spinBtn.addEventListener('click', doSpin);
el('again').addEventListener('click', () => { refreshWheel(); doSpin(); });

buildTypeChips();
refreshWheel();

const sharedKey = new URLSearchParams(location.search).get('key');
if (sharedKey) {
  const shared = findByKey(activities, sharedKey);
  if (shared) showResult(shared);
}
