import { css } from '@emotion/react';

const Button = ({ onClick, className, children }) => {
  return (
    <button
      css={css`
        border: none;
        transition: transform 0.1s;
        background-color: var(--control-background-color);
        font-size: 1rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        cursor: pointer;
        padding: 0.5rem;
        &:hover {
          filter: brightness(120%);
        }
        &:active {
          filter: brightness(80%);
          transform: translate(1px, 1px);
        }
      `}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
