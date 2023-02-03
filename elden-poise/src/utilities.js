import { BULL_GOAT_TALISMAN_MULTIPLIER, WORKER_PATH } from './constants';

export function applyBullGoatMultiplier(poise) {
  return Math.trunc(poise * BULL_GOAT_TALISMAN_MULTIPLIER);
}

export function calculateTopCombosAsync(
  armorData,
  targetPoise,
  importances,
  callback
) {
  const worker = new Worker(WORKER_PATH);
  worker.onmessage = (e) => {
    callback(e.data);
    worker.terminate();
  };
  worker.postMessage([armorData, targetPoise, importances]);
}

export function calculateMaxAchievablePoise(armorData) {
  let poise = 0;
  for (let slot of ['head', 'body', 'arms', 'legs']) {
    const poises = armorData.filter((x) => x.slot === slot).map((x) => x.poise);
    if (poises.length >= 1) {
      poise += Math.max(...poises);
    }
  }
  return poise;
}
