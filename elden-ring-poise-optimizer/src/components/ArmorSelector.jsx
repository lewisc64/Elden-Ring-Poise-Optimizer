import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { ARMOR_NAME_ALIASES, SLOT_TITLES } from '../constants';

import Checkbox from './Checkbox';
import ArmorReadout from './ArmorReadout';
import Button from './Button';
import TextBox from './TextBox';
import UnintrusiveText from './UnintrusiveText';

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
    <div>
      <h1
        css={css`
          margin: 0;
        `}
      >
        {title}
      </h1>
      <TextBox
        css={css`
          width: 100%;
        `}
        placeholder="Filter"
        onChange={(e) => {
          setSearchFilter(e.target.value);
        }}
      />
      <div
        css={css`
          display: flex;
          justify-content: flex-start;
          column-gap: 0.5rem;
        `}
      >
        <Button
          onClick={() => {
            setSelected([...armorData]);
          }}
        >
          Select All
        </Button>
        <Button
          onClick={() => {
            setSelected([]);
          }}
        >
          Select None
        </Button>
      </div>
      <ol
        css={css`
          margin: 0;
          padding: 0;
          height: 25rem;
          overflow-y: scroll;
          background-color: #333;
          padding: 0.5rem;
        `}
      >
        {armorData
          .filter(
            (x) =>
              x.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
              ARMOR_NAME_ALIASES[x.name]?.some((y) =>
                y.toLowerCase().includes(searchFilter.toLowerCase())
              )
          )
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((x) => (
            <li
              css={css`
                display: flex;
                align-items: center;
                list-style: none;
              `}
              key={x.name}
            >
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
      <UnintrusiveText
        css={css`
          display: block;
          margin-top: 0.5rem;
        `}
      >
        {`${selected.length} item${selected.length === 1 ? '' : 's'} selected.`}
      </UnintrusiveText>
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
    <div
      css={css`
        display: inline-flex;
        flex-wrap: wrap;
        grid-column-gap: 1rem;
      `}
    >
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
