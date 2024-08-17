import { css } from '@emotion/react';

const UnintrusiveText = ({ className, children }) => {
  return (
    <span
      css={css`
        color: #666;
        font-size: 0.8rem;
        font-style: italic;
      `}
      className={className}
    >
      {children}
    </span>
  );
};

export default UnintrusiveText;
