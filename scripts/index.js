const DATA_VERSION = "1.08.1";

const SLOT_TITLES = {
  head: "Helms",
  body: "Chest Armor",
  arms: "Gauntlets",
  legs: "Greaves",
};

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
  defensePhysicalSlash: 0,
  defensePhysicalStrike: 0,
  defensePhysicalPierce: 0,
  defenseMagic: 0,
  defenseFire: 0,
  defenseLightning: 0,
  defenseHoly: 0,
};

const BULL_GOAT_TALISMAN_MULTIPLIER = 1.33;

const COMBO_LIMIT = 20;

function getArmorOfSlot(armorData, slot) {
  return armorData.filter((x) => x.slot === slot);
}

function createCombos(armorData, targetPoise) {
  const combos = [];
  for (let head of getArmorOfSlot(armorData, "head")) {
    for (let body of getArmorOfSlot(armorData, "body")) {
      for (let arms of getArmorOfSlot(armorData, "arms")) {
        for (let legs of getArmorOfSlot(armorData, "legs")) {
          const totalPoise = Math.trunc(
            head.poise + body.poise + arms.poise + legs.poise
          );
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
            <p>Physical (slash): {armor.defensePhysicalSlash}</p>
            <p>Physical (strike): {armor.defensePhysicalStrike}</p>
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
    <article>
      <p>Weight: {combo.weight}</p>
      <p>Poise: {combo.poise}</p>
      <ArmorReadout armor={combo.head} defaultExpanded={true} />
      <ArmorReadout armor={combo.body} defaultExpanded={true} />
      <ArmorReadout armor={combo.arms} defaultExpanded={true} />
      <ArmorReadout armor={combo.legs} defaultExpanded={true} />
    </article>
  );
};

const ResultsDialog = ({ armorData, combos, show, setShow }) => {
  if (show) {
    return (
      <dialog open className="results">
        <button
          onClick={() => {
            setShow(false);
          }}
        >
          Close
        </button>
        {armorData.length >= 1 ? (
          <ol>
            {combos.map((x) => (
              <li key={JSON.stringify(x)}>
                <ArmorComboReadout combo={x} />
              </li>
            ))}
          </ol>
        ) : (
          <p>Select some more armor!</p>
        )}
      </dialog>
    );
  } else {
    return <div></div>;
  }
};

const PoiseCalculator = ({ armorData }) => {
  const [useBullGoats, setUseBullGoats] = React.useState(true);
  const [targetPoise, setTargetPoise] = React.useState(89);
  const [allowNothingForHead, setAllowNothingForHead] = React.useState(true);
  const [allowNothingForBody, setAllowNothingForBody] = React.useState(true);
  const [allowNothingForArms, setAllowNothingForArms] = React.useState(true);
  const [allowNothingForLegs, setAllowNothingForLegs] = React.useState(true);

  const [topCombos, setTopCombos] = React.useState([]);
  const [shouldCalculate, setShouldCalculate] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);

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

      const combos = createCombos(
        useData,
        Math.ceil(
          targetPoise / (useBullGoats ? BULL_GOAT_TALISMAN_MULTIPLIER : 1)
        )
      );
      setTopCombos(
        combos.sort((a, b) => a.weight - b.weight).slice(0, COMBO_LIMIT)
      );
      setShowResults(true);
    }
  }, [armorData, targetPoise, useBullGoats, shouldCalculate]);

  return (
    <div className="poiseCalculator">
      <div className="settings">
        <p>Target Poise:</p>
        <input
          placeholder="Target poise"
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
      <button
        onClick={() => {
          setShouldCalculate(true);
        }}
      >
        Calculate!
      </button>
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
      let response = await fetch("data/armor_data.json");
      setArmorData(await response.json());
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
