import { applyBullGoatMultiplier } from '../utilities';
import ArmorReadout from './ArmorReadout';

import './ArmorComboReadout.css';

const ArmorComboReadout = ({ combo }) => {
  return (
    <article className="comboReadout">
      <div className="combos">
        <p>Head: </p>
        <ArmorReadout armor={combo.head} />
        <p>Body: </p>
        <ArmorReadout armor={combo.body} />
        <p>Arms: </p>
        <ArmorReadout armor={combo.arms} />
        <p>Legs: </p>
        <ArmorReadout armor={combo.legs} />
      </div>
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
    </article>
  );
};

export default ArmorComboReadout;
