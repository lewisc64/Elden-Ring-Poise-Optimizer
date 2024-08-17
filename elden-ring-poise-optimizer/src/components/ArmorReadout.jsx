import { useState } from 'react';
import { css } from '@emotion/react';
import { ARMOR_NOTHING } from '../constants';
import { getWikiLink } from '../utilities';

const ArmorReadout = ({ armor, defaultExpanded }) => {
  const [shouldShowDetail, setShouldShowDetail] = useState(defaultExpanded);

  return (
    <article
      css={css`
        display: inline-block;
        background-color: #aaa;
        color: #222;
        font-size: 0.8rem;
        width: 20rem;
      `}
    >
      <h1
        css={css`
          font-size: 1.2rem;
          margin: 0.5rem;
          cursor: pointer;
          user-select: none;
        `}
        onClick={() => {
          setShouldShowDetail(!shouldShowDetail);
        }}
      >
        {armor.name}
      </h1>
      {shouldShowDetail ? (
        <div
          css={css`
            margin: 0.5rem;
            display: grid;
            position: relative;
            grid-template:
              'a c d'
              'b c d';
            grid-column-gap: 0.2rem;
            grid-row-gap: 0.2rem;
            background-color: #999;
            padding: 0.5rem;
            > div {
              h2 {
                font-size: 1rem;
                margin: 0;
              }
              p {
                margin: 0;
              }
            }
          `}
        >
          <div
            css={css`
              grid-area: a;
            `}
          >
            <h2>Weight</h2>
            <p
              css={css`
                font-size: 1.5rem;
                text-align: center;
                font-weight: bold;
              `}
            >
              {armor.weight}
            </p>
          </div>
          <div
            css={css`
              grid-area: b;
            `}
          >
            <h2>Poise</h2>
            <p
              css={css`
                font-size: 1.5rem;
                text-align: center;
                font-weight: bold;
              `}
            >
              {armor.poise}
            </p>
          </div>
          <div
            css={css`
              grid-area: c;
            `}
          >
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
          <div
            css={css`
              grid-area: d;
            `}
          >
            <h2>Resistances</h2>
            <p>Immunity: {armor.immunity}</p>
            <p>Robustness: {armor.robustness}</p>
            <p>Focus: {armor.focus}</p>
            <p>Vitality: {armor.vitality}</p>
          </div>
          {armor.name !== ARMOR_NOTHING.name ? (
            <a
              css={css`
                position: absolute;
                right: 0.5rem;
                bottom: 0.5rem;
              `}
              href={getWikiLink(armor)}
            >
              wiki
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

export default ArmorReadout;
