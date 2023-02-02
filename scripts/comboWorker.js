const COMBO_LIMIT = 20;

function calculateScoreOfCombo(combo, importances) {
  let totalDefense = 0;
  let totalResistance = 0;
  for (let slot of ["head", "body", "arms", "legs"]) {
    totalDefense += combo[slot].defensePhysical * importances.defensePhysical;
    totalDefense +=
      combo[slot].defensePhysicalSlash * importances.defensePhysicalSlash;
    totalDefense +=
      combo[slot].defensePhysicalStrike * importances.defensePhysicalStrike;
    totalDefense +=
      combo[slot].defensePhysicalPierce * importances.defensePhysicalPierce;
    totalDefense += combo[slot].defenseMagic * importances.defenseMagic;
    totalDefense += combo[slot].defenseFire * importances.defenseFire;
    totalDefense += combo[slot].defenseLightning * importances.defenseLightning;
    totalDefense += combo[slot].defenseHoly * importances.defenseHoly;

    totalResistance += combo[slot].immunity * importances.immunity;
    totalResistance += combo[slot].robustness * importances.robustness;
    totalResistance += combo[slot].focus * importances.focus;
    totalResistance += combo[slot].vitality * importances.vitality;
  }
  return -combo.weight * importances.weight + totalDefense + totalResistance;
}

function getArmorOfSlot(armorData, slot) {
  return armorData.filter((x) => x.slot === slot);
}

function createCombos(armorData, targetPoise) {
  const combos = [];
  for (let head of getArmorOfSlot(armorData, "head")) {
    for (let body of getArmorOfSlot(armorData, "body")) {
      for (let arms of getArmorOfSlot(armorData, "arms")) {
        for (let legs of getArmorOfSlot(armorData, "legs")) {
          const totalPoise = head.poise + body.poise + arms.poise + legs.poise;
          if (totalPoise == targetPoise) {
            const totalWeight =
              Math.round(
                (head.weight + body.weight + arms.weight + legs.weight) * 10
              ) / 10;
            combos.push({
              head: head,
              body: body,
              arms: arms,
              legs: legs,
              poise: totalPoise,
              weight: totalWeight,
            });
          }
        }
      }
    }
  }
  return combos;
}

onmessage = (e) => {
  const [armorData, targetPoise, importances] = e.data;
  const combos = createCombos(armorData, targetPoise);
  combos.sort(
    (a, b) =>
      calculateScoreOfCombo(b, importances) -
      calculateScoreOfCombo(a, importances)
  );
  postMessage(combos.slice(0, COMBO_LIMIT));
};
