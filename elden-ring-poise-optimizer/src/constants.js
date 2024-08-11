export const DATA_VERSION = '1.13.1';

export const DATA_SOURCE_LINK =
  'https://er-frame-data.nyasu.business/params?pt=EquipParamProtector';

export const DATA_SOURCE_DESCRIPTION = 'er-frame-data';

export const GITHUB_LINK =
  'https://github.com/lewisc64/Elden-Ring-Poise-Optimizer';

export const WIKI_URL = `https://eldenring.wiki.fextralife.com/`;

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
  poise: 2000000,
  weight: -1000000,
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

export const COMBO_FILTER_METHOD = {
  BY_TARGET_POISE: 'byTargetPoise',
  BY_WEIGHT_LIMIT: 'byWeightLimit',
  BY_NOTHING: 'byNothing',
};

export const ROLL_TYPE = {
  LIGHT_ROLL: 'lightRoll',
  MEDIUM_ROLL: 'mediumRoll',
  HEAVY_ROLL: 'heavyRoll',
  OVERENCUMBERED: 'overEncumbered',
};

export const ROLL_PERCENTAGES = {
  [ROLL_TYPE.LIGHT_ROLL]: 0.3,
  [ROLL_TYPE.MEDIUM_ROLL]: 0.7,
  [ROLL_TYPE.HEAVY_ROLL]: 1.0,
  [ROLL_TYPE.OVERENCUMBERED]: Infinity,
};
