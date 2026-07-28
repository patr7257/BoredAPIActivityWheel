export function filterActivities(all, { participants = 'any', price = 'any', types = [] } = {}) {
  return all.filter((a) => {
    if (participants === '1' && a.participants !== 1) return false;
    if (participants === '2' && a.participants !== 2) return false;
    if (participants === '4plus' && a.participants < 4) return false;
    if (price === 'free' && a.price !== 0) return false;
    if (price === 'cheap' && a.price > 0.3) return false;
    if (types.length > 0 && !types.includes(a.type)) return false;
    return true;
  });
}

export function pickCandidates(pool, n = 8, rng = Math.random) {
  const copy = [...pool];
  const count = Math.min(n, copy.length);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rng() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export function segmentAtAngle(finalAngle, segmentCount) {
  const TAU = Math.PI * 2;
  const seg = TAU / segmentCount;
  const pointer = -Math.PI / 2;
  const a = (((pointer - finalAngle) % TAU) + TAU) % TAU;
  return Math.floor(a / seg);
}

export function findByKey(all, key) {
  const found = all.find((a) => String(a.key) === String(key));
  return found === undefined ? null : found;
}
