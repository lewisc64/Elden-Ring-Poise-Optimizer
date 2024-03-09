import { useState } from 'react';
import { getWikiLink } from '../utilities';

import './ArmorReadout.css';

const ArmorReadout = ({ armor, defaultExpanded }) => {
  const [shouldShowDetail, setShouldShowDetail] = useState(defaultExpanded);

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
          <a className="wikiLink" href={getWikiLink(armor)}>
            wiki
          </a>
        </div>
      ) : null}
    </article>
  );
};

export default ArmorReadout;
