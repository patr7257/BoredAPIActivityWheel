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
