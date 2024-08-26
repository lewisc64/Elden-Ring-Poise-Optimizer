import { BULL_GOAT_TALISMAN_MULTIPLIER, WIKI_URL } from './constants';
import ComboWorker from './comboWorker?worker';

export function applyBullGoatMultiplier(poise) {
  return poise * BULL_GOAT_TALISMAN_MULTIPLIER;
}

export function calculateTopCombos(method, data, callback, progressCallback) {
  const worker = new ComboWorker();
  worker.onmessage = (e) => {
    if (e.data.messageType === 'progress') {
      progressCallback(e.data.data);
    } else if (e.data.messageType === 'result') {
      callback(e.data.data);
      worker.terminate();
    }
  };
  worker.postMessage({ method, data });
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

export function getWikiLink(armor) {
  return `${WIKI_URL}${armor.name.replaceAll(' ', '+')}`;
}
