export const moveTowards = (current, target, maxDelta) => {
  if (current < target) return Math.min(current + maxDelta, target);
  else if (current > target) return Math.max(current - maxDelta, target);
  else return current;
}

const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
export const inverseLerp = (x, y, a) => clamp((a - x) / (y - x));