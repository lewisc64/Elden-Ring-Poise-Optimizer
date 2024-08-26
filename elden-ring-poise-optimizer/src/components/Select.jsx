import { css } from '@emotion/react';

const Select = ({ onChange, defaultValue, className, children }) => {
  return (
    <select
      css={css`
        border: none;
        background-color: var(--control-background-color);
        font-size: 1rem;
        padding: 0.2rem;
        min-width: 8rem;
      `}
      className={className}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      {children}
    </select>
  );
};

export default Select;
