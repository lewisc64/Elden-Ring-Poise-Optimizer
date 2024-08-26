import { useState } from 'react';
import { css, Global } from '@emotion/react';
import {
  UNOBTAINABLE_ARMOR_NAMES,
  DATA_VERSION,
  DATA_SOURCE_LINK,
  DATA_SOURCE_DESCRIPTION,
  GITHUB_LINK,
} from './constants';
import baseArmorData from './data/armor_data.json';

import { ArmorSelectionAggregator } from './components/ArmorSelector';
import PoiseCalculator from './components/PoiseCalculator';
import UnintrusiveText from './components/UnintrusiveText';

const App = () => {
  const [armorData] = useState(
    baseArmorData.filter((x) => !UNOBTAINABLE_ARMOR_NAMES.includes(x.name))
  );
  const [selectedArmor, setSelectedArmor] = useState([]);

  return (
    <div>
      <Global
        styles={css`
          :root {
            --control-background-color: #888;
            --positive-control-background-color: #66a;
            --negative-control-background-color: #a66;
            --panel-background-color: #2a2a2a;
          }
          body {
            font-family: sans-serif;
            background-color: #222;
            color: #eee;
          }
        `}
      />
      <UnintrusiveText
        css={css`
          display: block;
          margin-bottom: 1rem;
        `}
      >
        For version '{DATA_VERSION}'. Data source:{' '}
        <a href={DATA_SOURCE_LINK}>{DATA_SOURCE_DESCRIPTION}</a>.
      </UnintrusiveText>
      <a
        css={css`
          position: fixed;
          top: 1rem;
          right: 1rem;
        `}
        href={GITHUB_LINK}
      >
        <img alt="GitHub logo" src="./github-logo.png"></img>
      </a>
      <ArmorSelectionAggregator
        armorData={armorData}
        updateSelected={setSelectedArmor}
      />
      <PoiseCalculator
        css={css`
          margin-top: 1rem;
        `}
        armorData={selectedArmor}
      />
    </div>
  );
};

export default App;
