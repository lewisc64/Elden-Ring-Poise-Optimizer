import { useState, useEffect, useCallback, Fragment } from 'react';
import {
  ARMOR_NOTHING,
  BULL_GOAT_TALISMAN_MULTIPLIER,
  ARMOR_ATTRIBUTE_NAME_MAP,
  DEFAULT_IMPORTANCES,
  COMBO_FILTER_METHOD,
  ROLL_TYPE,
  ROLL_PERCENTAGES,
} from '../constants';
import {
  calculateTopCombos,
  calculateMaxAchievablePoise,
  applyBullGoatMultiplier,
} from '../utilities';

import CollapsablePanel from './CollapsablePanel';
import Checkbox from './Checkbox';
import ResultsDialog from './ResultsDialog';

import './PoiseCalculator.css';

const PoiseCalculator = ({ armorData }) => {
  const [comboFilterMethod, setComboFilterMethod] = useState(
    COMBO_FILTER_METHOD.BY_TARGET_POISE
  );
  const [useBullGoats, setUseBullGoats] = useState(true);
  const [targetPoise, setTargetPoise] = useState(101);
  const [equipLoadWhileNaked, setEquipLoadWhileNaked] = useState(16.6);
  const [maxEquipLoad, setMaxEquipLoad] = useState(85.7);
  const [desiredRollType, setDesiredRollType] = useState(ROLL_TYPE.MEDIUM_ROLL);
  const [allowNothingForHead, setAllowNothingForHead] = useState(true);
  const [allowNothingForBody, setAllowNothingForBody] = useState(true);
  const [allowNothingForArms, setAllowNothingForArms] = useState(true);
  const [allowNothingForLegs, setAllowNothingForLegs] = useState(true);
  const [importances, setImportances] = useState(DEFAULT_IMPORTANCES);

  const [topCombos, setTopCombos] = useState([]);
  const [shouldCalculate, setShouldCalculate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState('0%');

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
      const callback = (combos) => {
        setTopCombos(combos);
        setIsProcessing(false);
        setShowResults(true);
        setProgressPercentage('0%');
      };

      const progressCallback = ({ processed, total }) => {
        setProgressPercentage(
          `${Math.round(((processed * 100) / total) * 10) / 10}%`
        );
      };

      calculateTopCombos(
        comboFilterMethod,
        {
          armorData: useData,
          targetPoise: Math.ceil(
            targetPoise / (useBullGoats ? BULL_GOAT_TALISMAN_MULTIPLIER : 1)
          ),
          importances: importances,
          weightLimit:
            Math.round(
              (maxEquipLoad * ROLL_PERCENTAGES[desiredRollType] -
                equipLoadWhileNaked) *
                10
            ) / 10,
        },
        callback,
        progressCallback
      );
    }
  }, [
    armorData,
    comboFilterMethod,
    targetPoise,
    useBullGoats,
    shouldCalculate,
    allowNothingForHead,
    allowNothingForBody,
    allowNothingForArms,
    allowNothingForLegs,
    importances,
    maxEquipLoad,
    equipLoadWhileNaked,
    desiredRollType,
  ]);

  return (
    <div className="poiseCalculator">
      <CollapsablePanel title="Selection Settings" collapsedByDefault={false}>
        <div className="settings">
          <p>Filter Method</p>
          <select
            onChange={(e) => {
              setComboFilterMethod(e.target.value);
            }}
          >
            <option value={COMBO_FILTER_METHOD.BY_TARGET_POISE}>
              Target Poise
            </option>
            <option value={COMBO_FILTER_METHOD.BY_WEIGHT_LIMIT}>
              Weight Limit
            </option>
            <option value={COMBO_FILTER_METHOD.BY_NOTHING}>
              None (single top-scoring result)
            </option>
          </select>
          {comboFilterMethod === COMBO_FILTER_METHOD.BY_TARGET_POISE ? (
            <>
              {' '}
              <p>
                Target Poise (max.{' '}
                {useBullGoats
                  ? applyBullGoatMultiplier(
                      calculateMaxAchievablePoise(armorData)
                    )
                  : calculateMaxAchievablePoise(armorData)}
                )
              </p>
              <input
                placeholder="Target poise"
                type="number"
                defaultValue={targetPoise}
                onChange={(e) => {
                  setTargetPoise(parseInt(e.target.value));
                }}
              ></input>
              <p>Use Bull-Goat's Talisman?</p>
              <Checkbox
                checked={useBullGoats}
                updateChecked={setUseBullGoats}
              />
            </>
          ) : null}
          {comboFilterMethod === COMBO_FILTER_METHOD.BY_WEIGHT_LIMIT ? (
            <>
              <p>Equip Load While Naked</p>
              <input
                placeholder="Equip load while naked"
                defaultValue={equipLoadWhileNaked}
                onChange={(e) => {
                  setEquipLoadWhileNaked(parseFloat(e.target.value));
                }}
              ></input>
              <p>Maximum Equip Load</p>
              <input
                placeholder="Max equip load"
                defaultValue={maxEquipLoad}
                onChange={(e) => {
                  setMaxEquipLoad(parseFloat(e.target.value));
                }}
              ></input>
              <p>Desired Roll Type</p>
              <select
                onChange={(e) => {
                  setDesiredRollType(e.target.value);
                }}
                defaultValue={desiredRollType}
              >
                <option value={ROLL_TYPE.LIGHT_ROLL}>Light roll</option>
                <option value={ROLL_TYPE.MEDIUM_ROLL}>Medium roll</option>
                <option value={ROLL_TYPE.HEAVY_ROLL}>Heavy roll</option>
                <option value={ROLL_TYPE.OVERENCUMBERED}>
                  Over-encumbered
                </option>
              </select>
            </>
          ) : null}
          <p>Allow nothing for helm?</p>
          <Checkbox
            checked={allowNothingForHead}
            updateChecked={setAllowNothingForHead}
          />
          <p>Allow nothing for chest?</p>
          <Checkbox
            checked={allowNothingForBody}
            updateChecked={setAllowNothingForBody}
          />
          <p>Allow nothing for gauntlets?</p>
          <Checkbox
            checked={allowNothingForArms}
            updateChecked={setAllowNothingForArms}
          />
          <p>Allow nothing for greaves?</p>
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
              <p>{ARMOR_ATTRIBUTE_NAME_MAP[x]} importance</p>
              <input
                placeholder={`${ARMOR_ATTRIBUTE_NAME_MAP[x]} importance`}
                type="number"
                defaultValue={importances[x]}
                onChange={(e) => {
                  setImportance(x, e.target.value);
                }}
              ></input>
            </Fragment>
          ))}
        </div>
      </CollapsablePanel>
      {isProcessing ? (
        <p className="doingSomething">
          Processing combinations... ({progressPercentage})
        </p>
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
