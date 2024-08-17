import { css } from '@emotion/react';

const Select = ({ onChange, defaultValue, className, children }) => {
  return (
    <select
      css={css`
        border: none;
        background-color: var(--control-background-color);
        font-size: 1rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        padding: 0.2rem;
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
