const COMBO_LIMIT = 50;

let armorScoreCache = {};

function calculateScoreOfArmor(armor, importances) {
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

function createCombos(
  armorData,
  importances,
  filterStrategy,
  progressCallback
) {
  const results = [];
  let lowestScore = -Infinity;

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
            const score = calculateScoreOfCombo(combo, importances);

            if (score > lowestScore) {
              combo.score = score;
              for (let i = 0; i < results.length + 1; i++) {
                if (results[i] === undefined || score < results[i].score) {
                  results.splice(i, 0, combo);
                  break;
                }
              }
              if (results.length > COMBO_LIMIT) {
                results.shift(1);
              }
              lowestScore = results[0].score;
            }
          }
          if (++combosProcessed % progressCallInterval === 0) {
            progressCallback(combosProcessed, numberOfCombos);
          }
        }
      }
    }
  }
  return results;
}

function getTopScoringArmorPiece(armorData, importances) {
  let top = null;
  let topScore = -Infinity;
  for (let armor of armorData) {
    const score = calculateScoreOfArmor(armor, importances);
    if (score > topScore) {
      topScore = score;
      top = armor;
    }
  }
  return top;
}

function getTopScoringCombo(armorData, importances) {
  const combo = {};
  for (let slot of ['head', 'body', 'arms', 'legs']) {
    combo[slot] = getTopScoringArmorPiece(
      getArmorOfSlot(armorData, slot),
      importances
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
  combo.score = calculateScoreOfCombo(combo, importances);
  return combo;
}

onmessage = (e) => {
  if (e.data.method === 'byNothing') {
    const combo = getTopScoringCombo(
      e.data.data.armorData,
      e.data.data.importances
    );
    if (combo) {
      postMessage({ messageType: 'result', data: [combo] });
      return;
    }
    postMessage({ messageType: 'result', data: [] });
    return;
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

  armorScoreCache = {};
  const combos = createCombos(
    e.data.data.armorData,
    e.data.data.importances,
    filterStrategy,
    progressCallback
  );

  combos.sort((a, b) => b.score - a.score);

  postMessage({ messageType: 'result', data: combos });
};
