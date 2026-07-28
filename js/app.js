import { filterActivities, pickCandidates } from './logic.js';
import { Wheel } from './wheel.js';

const activities = await (await fetch('./data/activities.json')).json();
const wheel = new Wheel(document.getElementById('wheel'));
const candidates = pickCandidates(filterActivities(activities, {}), 8);
wheel.setItems(candidates.map((a) => a.activity));
