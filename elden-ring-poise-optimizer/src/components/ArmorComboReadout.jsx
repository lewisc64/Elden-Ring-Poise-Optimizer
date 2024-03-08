import { applyBullGoatMultiplier } from '../utilities';
import ArmorReadout from './ArmorReadout';

import './ArmorComboReadout.css';

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

export default ArmorComboReadout;
