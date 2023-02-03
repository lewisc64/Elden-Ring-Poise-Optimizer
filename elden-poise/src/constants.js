export const DATA_VERSION = '1.08.1';
export const WORKER_PATH = 'comboWorker.js';

export const SLOT_TITLES = {
  head: 'Helms',
  body: 'Chest Armor',
  arms: 'Gauntlets',
  legs: 'Greaves',
};

export const UNOBTAINABLE_ARMOR_NAMES = [
  'Ragged Hat',
  'Ragged Hat (Altered)',
  'Ragged Armor',
  'Ragged Armor (Altered)',
  'Ragged Gloves',
  'Ragged Loincloth',
  "Millicent's Robe",
  "Millicent's Tunic",
  "Millicent's Gloves",
  "Millicent's Boots",
  "Brave's Leather Helm",
  "Brave's Cord Circlet",
  "Brave's Battlewear",
  "Brave's Battlewear (Altered)",
  "Brave's Bracer",
  "Brave's Legwraps",
  'Golden Prosthetic',
  'Deathbed Smalls',
  'Grass Hair Ornament',
];

export const ARMOR_NOTHING = {
  name: 'Nothing',
  slot: 'DEFINE',
  weight: 0,
  poise: 0,
  immunity: 0,
  robustness: 0,
  focus: 0,
  vitality: 0,
  defensePhysical: 0,
  defensePhysicalStrike: 0,
  defensePhysicalSlash: 0,
  defensePhysicalPierce: 0,
  defenseMagic: 0,
  defenseFire: 0,
  defenseLightning: 0,
  defenseHoly: 0,
};

export const ARMOR_ATTRIBUTE_NAME_MAP = {
  name: 'Name',
  slot: 'Slot',
  weight: 'Weight',
  poise: 'Poise',
  immunity: 'Immunity',
  robustness: 'Robustness',
  focus: 'Focus',
  vitality: 'Vitality',
  defensePhysical: 'Physical Defense',
  defensePhysicalStrike: 'Physical Defense (strike)',
  defensePhysicalSlash: 'Physical Defense (slash)',
  defensePhysicalPierce: 'Physical Defense (pierce)',
  defenseMagic: 'Magic Defense',
  defenseFire: 'Fire Defense',
  defenseLightning: 'Lightning Defense',
  defenseHoly: 'Holy Defense',
};

export const BULL_GOAT_TALISMAN_MULTIPLIER = 4 / 3;

export const DEFAULT_IMPORTANCES = {
  weight: 1000000,
  immunity: 1,
  robustness: 1,
  focus: 1,
  vitality: 0,
  defensePhysical: 10,
  defensePhysicalStrike: 10,
  defensePhysicalSlash: 10,
  defensePhysicalPierce: 10,
  defenseMagic: 10,
  defenseFire: 10,
  defenseLightning: 10,
  defenseHoly: 10,
};
