const DATA_VERSION = "1.08.1";

const SLOT_TITLES = {
  head: "Helms",
  body: "Chest Armor",
  arms: "Gauntlets",
  legs: "Greaves",
};

const UNOBTAINABLE_ARMOR_NAMES = [
  "Ragged Hat",
  "Ragged Hat (Altered)",
  "Ragged Armor",
  "Ragged Armor (Altered)",
  "Ragged Gloves",
  "Ragged Loincloth",
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
  "Golden Prosthetic",
  "Deathbed Smalls",
  "Grass Hair Ornament",
];

const ARMOR_NOTHING = {
  name: "Nothing",
  slot: "DEFINE",
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

const ARMOR_ATTRIBUTE_NAME_MAP = {
  name: "Name",
  slot: "Slot",
  weight: "Weight",
  poise: "Poise",
  immunity: "Immunity",
  robustness: "Robustness",
  focus: "Focus",
  vitality: "Vitality",
  defensePhysical: "Physical Defense",
  defensePhysicalStrike: "Physical Defense (strike)",
  defensePhysicalSlash: "Physical Defense (slash)",
  defensePhysicalPierce: "Physical Defense (pierce)",
  defenseMagic: "Magic Defense",
  defenseFire: "Fire Defense",
  defenseLightning: "Lightning Defense",
  defenseHoly: "Holy Defense",
};

const BULL_GOAT_TALISMAN_MULTIPLIER = 4 / 3;

function applyBullGoatMultiplier(poise) {
  return Math.trunc(poise * BULL_GOAT_TALISMAN_MULTIPLIER);
}

function calculateTopCombosAsync(
  armorData,
  targetPoise,
  importances,
  callback
) {
  const worker = new Worker("scripts/comboWorker.js");
  worker.onmessage = (e) => {
    callback(e.data);
    worker.terminate();
  };
  worker.postMessage([armorData, targetPoise, importances]);
}

function calculateMaxAchievablePoise(armorData) {
  let poise = 0;
  for (let slot of ["head", "body", "arms", "legs"]) {
    const poises = armorData.filter((x) => x.slot === slot).map((x) => x.poise);
    if (poises.length >= 1) {
      poise += Math.max(...poises);
    }
  }
  return poise;
}

const Checkbox = ({ checked, updateChecked }) => {
  return (
    <div
      className={`checkbox ${checked ? "active" : "inactive"}`}
      onClick={() => {
        updateChecked(!checked);
      }}
    >
      {checked ? "YES" : "NO"}
    </div>
  );
};

const CollapsablePanel = ({ title, collapsedByDefault, children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsedByDefault);

  return (
    <div className="collapsablePanel">
      <p
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        <span className="monospaced">{isCollapsed ? "+" : "-"}</span> {title}
      </p>
      {isCollapsed ? null : children}
    </div>
  );
};

const ArmorReadout = ({ armor, defaultExpanded }) => {
  const [shouldShowDetail, setShouldShowDetail] =
    React.useState(defaultExpanded);

  return (
    <article className="armorReadout">
      <div className="armorReadoutTitle">
        <h1
          onClick={() => {
            setShouldShowDetail(!shouldShowDetail);
          }}
        >
          {armor.name}
        </h1>
      </div>
      {shouldShowDetail ? (
        <div className="armorReadoutContent">
          <div className="weight">
            <h2>Weight</h2>
            <p>{armor.weight}</p>
          </div>
          <div className="poise">
            <h2>Poise</h2>
            <p>{armor.poise}</p>
          </div>
          <div className="defenses">
            <h2>Defenses</h2>
            <p>Physical: {armor.defensePhysical}</p>
            <p>Physical (strike): {armor.defensePhysicalStrike}</p>
            <p>Physical (slash): {armor.defensePhysicalSlash}</p>
            <p>Physical (pierce): {armor.defensePhysicalPierce}</p>
            <p>Magic: {armor.defenseMagic}</p>
            <p>Fire: {armor.defenseFire}</p>
            <p>Lightning: {armor.defenseLightning}</p>
            <p>Holy: {armor.defenseHoly}</p>
          </div>
          <div className="resistances">
            <h2>Resistances</h2>
            <p>Immunity: {armor.immunity}</p>
            <p>Robustness: {armor.robustness}</p>
            <p>Focus: {armor.focus}</p>
            <p>Vitality: {armor.vitality}</p>
          </div>
        </div>
      ) : null}
    </article>
  );
};

const ArmorSelector = ({ title, armorData, updateSelected }) => {
  const [selected, setSelected] = React.useState([...armorData]);
  const [searchFilter, setSearchFilter] = React.useState("");

  React.useEffect(() => {
    updateSelected(selected);
  }, [selected]);

  const toggleArmor = (armor) => {
    if (selected.includes(armor)) {
      setSelected(selected.filter((x) => x != armor));
    } else {
      setSelected([...selected, armor]);
    }
  };

  return (
    <div className="armorSelector">
      <h1>{title}</h1>
      <input
        className="armorSearch"
        placeholder="Filter"
        onChange={(e) => {
          setSearchFilter(e.target.value);
        }}
      ></input>
      <div className="buttons">
        <button
          onClick={() => {
            setSelected([...armorData]);
          }}
        >
          Select All
        </button>
        <button
          onClick={() => {
            setSelected([]);
          }}
        >
          Select None
        </button>
      </div>
      <ol>
        {armorData
          .filter((x) =>
            x.name.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((x) => (
            <li key={x.name}>
              <Checkbox
                checked={selected.includes(x)}
                updateChecked={() => {
                  toggleArmor(x);
                }}
              />
              <ArmorReadout armor={x} />
            </li>
          ))}
      </ol>
      <p className="unintrusive">{`${selected.length} item${
        selected.length == 1 ? "" : "s"
      } selected.`}</p>
    </div>
  );
};

const ArmorSelectionAggregator = ({ armorData, updateSelected }) => {
  const [selected, setSelected] = React.useState([]);

  const [selectedHead, setSelectedHead] = React.useState([]);
  const [selectedBody, setSelectedBody] = React.useState([]);
  const [selectedArms, setSelectedArms] = React.useState([]);
  const [selectedLegs, setSelectedLegs] = React.useState([]);

  React.useEffect(() => {
    setSelected([
      ...selectedHead,
      ...selectedBody,
      ...selectedArms,
      ...selectedLegs,
    ]);
  }, [selectedHead, selectedBody, selectedArms, selectedLegs]);

  React.useEffect(() => {
    updateSelected(selected);
  }, [selected]);

  const updateSelectedForSlot = (newSelected, slot) => {
    if (slot === "head") {
      setSelectedHead(newSelected);
    } else if (slot === "body") {
      setSelectedBody(newSelected);
    } else if (slot === "arms") {
      setSelectedArms(newSelected);
    } else if (slot === "legs") {
      setSelectedLegs(newSelected);
    } else {
      throw `unknown slot: ${slot}`;
    }
  };

  return (
    <div className="armorSelectionAggregator">
      {["head", "body", "arms", "legs"].map((slot) => (
        <ArmorSelector
          key={slot}
          title={SLOT_TITLES[slot]}
          armorData={armorData.filter((x) => x.slot === slot)}
          updateSelected={(x) => {
            updateSelectedForSlot(x, slot);
          }}
        />
      ))}
    </div>
  );
};

const ArmorComboReadout = ({ combo }) => {
  return (
    <article className="comboReadout">
      <div className="details">
        <div>
          <p>Weight</p>
          <p>{combo.weight}</p>
        </div>
        <div>
          <p>Poise</p>
          <p>{combo.poise}</p>
        </div>
        <div>
          <p>Poise (Bull-Goat's)</p>
          <p>{applyBullGoatMultiplier(combo.poise)}</p>
        </div>
      </div>

      <div className="combos">
        <ArmorReadout armor={combo.head} defaultExpanded={true} />
        <ArmorReadout armor={combo.body} defaultExpanded={true} />
        <ArmorReadout armor={combo.arms} defaultExpanded={true} />
        <ArmorReadout armor={combo.legs} defaultExpanded={true} />
      </div>
    </article>
  );
};

const ResultsDialog = ({ combos, show, setShow }) => {
  if (show) {
    return (
      <div className="results">
        <button
          onClick={() => {
            setShow(false);
          }}
        >
          Close
        </button>
        {combos.length >= 1 ? (
          <ol>
            {combos.map((x) => (
              <li key={JSON.stringify(x)}>
                <ArmorComboReadout combo={x} />
              </li>
            ))}
          </ol>
        ) : (
          <p>There are no possible combinations.</p>
        )}
      </div>
    );
  } else {
    return <div></div>;
  }
};

const PoiseCalculator = ({ armorData }) => {
  const [useBullGoats, setUseBullGoats] = React.useState(true);
  const [targetPoise, setTargetPoise] = React.useState(83);
  const [allowNothingForHead, setAllowNothingForHead] = React.useState(true);
  const [allowNothingForBody, setAllowNothingForBody] = React.useState(true);
  const [allowNothingForArms, setAllowNothingForArms] = React.useState(true);
  const [allowNothingForLegs, setAllowNothingForLegs] = React.useState(true);
  const [importances, setImportances] = React.useState({
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
  });

  const [topCombos, setTopCombos] = React.useState([]);
  const [shouldCalculate, setShouldCalculate] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const setImportance = React.useCallback(
    (importanceName, value) => {
      const newImportances = { ...importances };
      newImportances[importanceName] = parseFloat(value);
      setImportances(newImportances);
    },
    [importances]
  );

  React.useEffect(() => {
    if (shouldCalculate) {
      setShouldCalculate(false);

      let useData = [...armorData];
      if (allowNothingForHead) {
        useData.push({ ...ARMOR_NOTHING, slot: "head" });
      }
      if (allowNothingForBody) {
        useData.push({ ...ARMOR_NOTHING, slot: "body" });
      }
      if (allowNothingForArms) {
        useData.push({ ...ARMOR_NOTHING, slot: "arms" });
      }
      if (allowNothingForLegs) {
        useData.push({ ...ARMOR_NOTHING, slot: "legs" });
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
  }, [armorData, targetPoise, useBullGoats, shouldCalculate]);

  return (
    <div className="poiseCalculator">
      <CollapsablePanel title="Selection Settings" collapsedByDefault={false}>
        <div className="settings">
          <p>
            Target Poise (max.{" "}
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
            <React.Fragment key={x}>
              <p>{ARMOR_ATTRIBUTE_NAME_MAP[x]} importance:</p>
              <input
                placeholder={`${ARMOR_ATTRIBUTE_NAME_MAP[x]} importance`}
                type="number"
                value={importances[x]}
                onChange={(e) => {
                  setImportance(x, e.target.value);
                }}
              ></input>
            </React.Fragment>
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

const Main = () => {
  const [hasLoadedData, setHasLoadedData] = React.useState(false);

  const [armorData, setArmorData] = React.useState([]);
  const [selectedArmor, setSelectedArmor] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      let response = await fetch("data/sources/datasheet/armor_data.json");
      setArmorData(
        (await response.json()).filter(
          (x) => !UNOBTAINABLE_ARMOR_NAMES.includes(x.name)
        )
      );
      setHasLoadedData(true);
    }
    if (!hasLoadedData) {
      fetchData();
    }
  }, [hasLoadedData]);

  if (!hasLoadedData) {
    return <p>Loading...</p>;
  } else {
    return (
      <div>
        <p className="unintrusive">For version '{DATA_VERSION}'.</p>
        <ArmorSelectionAggregator
          armorData={armorData}
          updateSelected={setSelectedArmor}
        />
        <PoiseCalculator armorData={selectedArmor} />
      </div>
    );
  }
};

ReactDOM.render(<Main />, document.querySelector("main"));
