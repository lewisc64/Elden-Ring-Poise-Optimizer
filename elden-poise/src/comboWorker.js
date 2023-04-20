const COMBO_LIMIT = 20;

let armorScoreCache = {};

function calculateScoreOfArmor(armor, importances) {
  if (armor === undefined) {
    return 0;
  }
  if (armorScoreCache[armor.name] !== undefined) {
    return armorScoreCache[armor.name];
  }

  let score = armor.weight * importances.weight;
  score += armor.poise * importances.poise;

  score += armor.defensePhysical * importances.defensePhysical;
  score += armor.defensePhysicalSlash * importances.defensePhysicalSlash;
  score += armor.defensePhysicalStrike * importances.defensePhysicalStrike;
  score += armor.defensePhysicalPierce * importances.defensePhysicalPierce;
  score += armor.defenseMagic * importances.defenseMagic;
  score += armor.defenseFire * importances.defenseFire;
  score += armor.defenseLightning * importances.defenseLightning;
  score += armor.defenseHoly * importances.defenseHoly;

  score += armor.immunity * importances.immunity;
  score += armor.robustness * importances.robustness;
  score += armor.focus * importances.focus;
  score += armor.vitality * importances.vitality;

  armorScoreCache[armor.name] = score;

  return score;
}

function calculateScoreOfCombo(combo, importances) {
  return (
    calculateScoreOfArmor(combo.head, importances) +
    calculateScoreOfArmor(combo.body, importances) +
    calculateScoreOfArmor(combo.arms, importances) +
    calculateScoreOfArmor(combo.legs, importances)
  );
}

function getArmorOfSlot(armorData, slot) {
  return armorData.filter((x) => x.slot === slot);
}

function* createCombos(
  armorData,
  scoreStrategy,
  filterStrategy,
  progressCallback
) {
  const headArmor = getArmorOfSlot(armorData, 'head');
  const bodyArmor = getArmorOfSlot(armorData, 'body');
  const armsArmor = getArmorOfSlot(armorData, 'arms');
  const legsArmor = getArmorOfSlot(armorData, 'legs');

  const numberOfCombos =
    headArmor.length * bodyArmor.length * armsArmor.length * legsArmor.length;
  let combosProcessed = 0;
  const progressCallInterval = Math.floor(numberOfCombos / 1000);

  for (let head of headArmor) {
    for (let body of bodyArmor) {
      for (let arms of armsArmor) {
        for (let legs of legsArmor) {
          const totalWeight =
            head.weight + body.weight + arms.weight + legs.weight;
          const totalPoise = head.poise + body.poise + arms.poise + legs.poise;
          if (filterStrategy(totalWeight, totalPoise)) {
            const combo = {
              head: head,
              body: body,
              arms: arms,
              legs: legs,
              poise: totalPoise,
              weight: Math.round(totalWeight * 10) / 10,
            };
            combo.score = scoreStrategy(combo);
            yield combo;
          }
          if (++combosProcessed % progressCallInterval === 0) {
            progressCallback(combosProcessed, numberOfCombos);
          }
        }
      }
    }
  }
}

function getTopScoringArmorPiece(armorData, scoreStrategy) {
  let top = null;
  let topScore = -Infinity;
  for (let armor of armorData) {
    const score = scoreStrategy({ [armor.slot]: armor });
    if (score > topScore) {
      topScore = score;
      top = armor;
    }
  }
  return top;
}

function getTopScoringCombo(armorData, scoreStrategy) {
  const combo = {};
  for (let slot of ['head', 'body', 'arms', 'legs']) {
    combo[slot] = getTopScoringArmorPiece(
      getArmorOfSlot(armorData, slot),
      scoreStrategy
    );
    if (combo[slot] === null) {
      return null;
    }
  }
  combo.poise =
    combo.head.poise + combo.body.poise + combo.arms.poise + combo.legs.poise;
  combo.weight =
    Math.round(
      (combo.head.weight +
        combo.body.weight +
        combo.arms.weight +
        combo.legs.weight) *
        10
    ) / 10;
  combo.score = scoreStrategy(combo);
  return combo;
}

onmessage = (e) => {
  const scoreStrategy = (combo) =>
    calculateScoreOfCombo(combo, e.data.data.importances);

  if (e.data.method === 'byNothing') {
    const combo = getTopScoringCombo(e.data.data.armorData, scoreStrategy);
    if (combo) {
      postMessage({ messageType: 'result', data: [combo] });
      return;
    }
    postMessage({ messageType: 'result', data: [] });
  }

  let filterStrategy;
  if (e.data.method === 'byTargetPoise') {
    filterStrategy = (_, poise) => poise === e.data.data.targetPoise;
  } else if (e.data.method === 'byWeightLimit') {
    filterStrategy = (weight, _) => weight < e.data.data.weightLimit;
  }

  const progressCallback = (processed, total) => {
    postMessage({ messageType: 'progress', data: { processed, total } });
  };

  let lowestScore = -Infinity;
  const combos = [];

  for (let combo of createCombos(
    e.data.data.armorData,
    scoreStrategy,
    filterStrategy,
    progressCallback
  )) {
    if (combo.score > lowestScore) {
      for (let i = 0; i < combos.length + 1; i++) {
        if (combos[i] === undefined || combo.score < combos[i].score) {
          combos.splice(i, 0, combo);
          break;
        }
      }
      if (combos.length > COMBO_LIMIT) {
        combos.shift(1);
      }
      lowestScore = combos[0].score;
    }
  }

  combos.sort((a, b) => b.score - a.score);
  armorScoreCache = {};

  postMessage({ messageType: 'result', data: combos });
};
