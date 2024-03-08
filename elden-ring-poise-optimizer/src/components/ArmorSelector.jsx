import { useState, useEffect } from 'react';
import { SLOT_TITLES } from '../constants';

import Checkbox from './Checkbox';
import ArmorReadout from './ArmorReadout';

import './ArmorSelector.css';

export const ArmorSelector = ({ title, armorData, updateSelected }) => {
  const [selected, setSelected] = useState([...armorData]);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    updateSelected(selected);
  }, [updateSelected, selected]);

  const toggleArmor = (armor) => {
    if (selected.includes(armor)) {
      setSelected(selected.filter((x) => x !== armor));
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
        selected.length === 1 ? '' : 's'
      } selected.`}</p>
    </div>
  );
};

export const ArmorSelectionAggregator = ({ armorData, updateSelected }) => {
  const [selected, setSelected] = useState([]);

  const [selectedHead, setSelectedHead] = useState([]);
  const [selectedBody, setSelectedBody] = useState([]);
  const [selectedArms, setSelectedArms] = useState([]);
  const [selectedLegs, setSelectedLegs] = useState([]);

  useEffect(() => {
    setSelected([
      ...selectedHead,
      ...selectedBody,
      ...selectedArms,
      ...selectedLegs,
    ]);
  }, [selectedHead, selectedBody, selectedArms, selectedLegs]);

  useEffect(() => {
    updateSelected(selected);
  }, [updateSelected, selected]);

  const updateSelectedForSlot = (newSelected, slot) => {
    if (slot === 'head') {
      setSelectedHead(newSelected);
    } else if (slot === 'body') {
      setSelectedBody(newSelected);
    } else if (slot === 'arms') {
      setSelectedArms(newSelected);
    } else if (slot === 'legs') {
      setSelectedLegs(newSelected);
    } else {
      throw new Error(`unknown slot: ${slot}`);
    }
  };

  return (
    <div className="armorSelectionAggregator">
      {['head', 'body', 'arms', 'legs'].map((slot) => (
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
