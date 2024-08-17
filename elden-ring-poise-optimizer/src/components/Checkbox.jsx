import { css } from '@emotion/react';

const Checkbox = ({ checked, updateChecked }) => {
  return (
    <div
      css={css`
        display: inline-block;
        width: 2rem;
        height: 2rem;
        text-align: center;
        line-height: 2rem;
        cursor: pointer;
        user-select: none;
      `}
      style={{
        backgroundColor: checked
          ? 'var(--positive-control-background-color)'
          : 'var(--negative-control-background-color)',
      }}
      onClick={() => {
        updateChecked(!checked);
      }}
    >
      {checked ? '✓' : 'X'}
    </div>
  );
};

export default Checkbox;
