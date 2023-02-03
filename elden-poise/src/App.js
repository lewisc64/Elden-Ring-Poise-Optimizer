import { useState } from 'react';
import { UNOBTAINABLE_ARMOR_NAMES, DATA_VERSION } from './constants';
import baseArmorData from './data/armor_data.json';

import { ArmorSelectionAggregator } from './components/ArmorSelector';
import PoiseCalculator from './components/PoiseCalculator';

import './App.css';

const App = () => {
  const [armorData] = useState(
    baseArmorData.filter((x) => !UNOBTAINABLE_ARMOR_NAMES.includes(x.name))
  );
  const [selectedArmor, setSelectedArmor] = useState([]);

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
};

export default App;
