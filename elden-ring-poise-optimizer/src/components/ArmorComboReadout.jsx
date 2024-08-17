import { css } from '@emotion/react';
import { applyBullGoatMultiplier } from '../utilities';
import ArmorReadout from './ArmorReadout';

const ArmorComboReadout = ({ combo }) => {
  return (
    <article
      css={css`
        display: inline-block;
        background-color: #444;
        padding: 0.5rem;
      `}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: auto 1fr;
          grid-column-gap: 0.5rem;
          align-items: center;
          grid-row-gap: 0.5rem;
          > p {
            margin: 0;
          }
        `}
      >
        <p>Head: </p>
        <ArmorReadout armor={combo.head} />
        <p>Body: </p>
        <ArmorReadout armor={combo.body} />
        <p>Arms: </p>
        <ArmorReadout armor={combo.arms} />
        <p>Legs: </p>
        <ArmorReadout armor={combo.legs} />
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr 2fr;
          grid-row-gap: 0.5rem;
          background-color: #aaa;
          color: #222;
          margin-top: 0.5rem;
          padding: 0.5rem;
          > p {
            text-align: center;
            margin: 0;
          }
        `}
      >
        <p>Weight</p>
        <p>Poise</p>
        <p>Poise (Bull-Goat's)</p>
        {[combo.weight, combo.poise, applyBullGoatMultiplier(combo.poise)].map(
          (x) => (
            <p
              css={css`
                font-size: 1.2rem;
                font-weight: 700;
              `}
            >
              {x}
            </p>
          )
        )}
      </div>
    </article>
  );
};

export default ArmorComboReadout;
