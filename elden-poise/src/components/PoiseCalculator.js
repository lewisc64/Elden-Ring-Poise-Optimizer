import { useState, useEffect, useCallback, Fragment } from 'react';
import {
  ARMOR_NOTHING,
  BULL_GOAT_TALISMAN_MULTIPLIER,
  ARMOR_ATTRIBUTE_NAME_MAP,
  DEFAULT_IMPORTANCES,
} from '../constants';
import {
  calculateTopCombosAsync,
  calculateMaxAchievablePoise,
  applyBullGoatMultiplier,
} from '../utilities';

import CollapsablePanel from './CollapsablePanel';
import Checkbox from './Checkbox';
import ResultsDialog from './ResultsDialog';

import './PoiseCalculator.css';

const PoiseCalculator = ({ armorData }) => {
  const [useBullGoats, setUseBullGoats] = useState(true);
  const [targetPoise, setTargetPoise] = useState(83);
  const [allowNothingForHead, setAllowNothingForHead] = useState(true);
  const [allowNothingForBody, setAllowNothingForBody] = useState(true);
  const [allowNothingForArms, setAllowNothingForArms] = useState(true);
  const [allowNothingForLegs, setAllowNothingForLegs] = useState(true);
  const [importances, setImportances] = useState(DEFAULT_IMPORTANCES);

  const [topCombos, setTopCombos] = useState([]);
  const [shouldCalculate, setShouldCalculate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const setImportance = useCallback(
    (importanceName, value) => {
      const newImportances = { ...importances };
      newImportances[importanceName] = parseFloat(value);
      setImportances(newImportances);
    },
    [importances]
  );

  useEffect(() => {
    if (shouldCalculate) {
      setShouldCalculate(false);

      let useData = [...armorData];
      if (allowNothingForHead) {
        useData.push({ ...ARMOR_NOTHING, slot: 'head' });
      }
      if (allowNothingForBody) {
        useData.push({ ...ARMOR_NOTHING, slot: 'body' });
      }
      if (allowNothingForArms) {
        useData.push({ ...ARMOR_NOTHING, slot: 'arms' });
      }
      if (allowNothingForLegs) {
        useData.push({ ...ARMOR_NOTHING, slot: 'legs' });
      }

      setIsProcessing(true);
      calculateTopCombosAsync(
        useData,
        Math.ceil(
          targetPoise / (useBullGoats ? BULL_GOAT_TALISMAN_MULTIPLIER : 1)
        ),
        importances,
        (combos) => {
          setTopCombos(combos);
          setIsProcessing(false);
          setShowResults(true);
        }
      );
    }
  }, [
    armorData,
    targetPoise,
    useBullGoats,
    shouldCalculate,
    allowNothingForHead,
    allowNothingForBody,
    allowNothingForArms,
    allowNothingForLegs,
    importances,
  ]);

  return (
    <div className="poiseCalculator">
      <CollapsablePanel title="Selection Settings" collapsedByDefault={false}>
        <div className="settings">
          <p>
            Target Poise (max.{' '}
            {useBullGoats
              ? applyBullGoatMultiplier(calculateMaxAchievablePoise(armorData))
              : calculateMaxAchievablePoise(armorData)}
            ):
          </p>
          <input
            placeholder="Target poise"
            type="number"
            value={targetPoise}
            onChange={(e) => {
              setTargetPoise(parseInt(e.target.value));
            }}
          ></input>
          <p>Use Bull-Goat's Talisman?:</p>
          <Checkbox checked={useBullGoats} updateChecked={setUseBullGoats} />
          <p>Allow nothing for helm?:</p>
          <Checkbox
            checked={allowNothingForHead}
            updateChecked={setAllowNothingForHead}
          />
          <p>Allow nothing for chest?:</p>
          <Checkbox
            checked={allowNothingForBody}
            updateChecked={setAllowNothingForBody}
          />
          <p>Allow nothing for gauntlets?:</p>
          <Checkbox
            checked={allowNothingForArms}
            updateChecked={setAllowNothingForArms}
          />
          <p>Allow nothing for greaves?:</p>
          <Checkbox
            checked={allowNothingForLegs}
            updateChecked={setAllowNothingForLegs}
          />
        </div>
      </CollapsablePanel>
      <CollapsablePanel title="Sorting Settings" collapsedByDefault={true}>
        <div className="settings">
          {Object.keys(importances).map((x) => (
            <Fragment key={x}>
              <p>{ARMOR_ATTRIBUTE_NAME_MAP[x]} importance:</p>
              <input
                placeholder={`${ARMOR_ATTRIBUTE_NAME_MAP[x]} importance`}
                type="number"
                value={importances[x]}
                onChange={(e) => {
                  setImportance(x, e.target.value);
                }}
              ></input>
            </Fragment>
          ))}
        </div>
      </CollapsablePanel>
      {isProcessing ? (
        <p className="doingSomething">Processing combinations...</p>
      ) : (
        <button
          onClick={() => {
            setShouldCalculate(true);
          }}
        >
          Calculate!
        </button>
      )}
      <ResultsDialog
        armorData={armorData}
        combos={topCombos}
        show={showResults}
        setShow={setShowResults}
      />
    </div>
  );
};

export default PoiseCalculator;
