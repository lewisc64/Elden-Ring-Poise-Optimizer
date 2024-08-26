import { css } from '@emotion/react';

const TextBox = ({ onChange, placeholder, type, defaultValue, className }) => {
  return (
    <input
      css={css`
        border: none;
        background-color: var(--control-background-color);
        font-size: 1rem;
        padding: 0.2rem;
        min-width: 8rem;
      `}
      className={className}
      placeholder={placeholder}
      type={type}
      defaultValue={defaultValue}
      onChange={onChange}
    ></input>
  );
};

export default TextBox;
