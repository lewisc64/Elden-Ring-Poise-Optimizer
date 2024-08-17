import { css, keyframes } from '@emotion/react';

const pulseKeyframes = keyframes`
  0% {
    filter: brightness(100%);
  }
  50% {
    filter: brightness(70%);
  }
  100% {
    filter: brightness(100%);
  }
`;

const PulsingText = ({ className, children }) => {
  return (
    <span
      css={css`
        animation: ${pulseKeyframes} 0.5s ease infinite;
      `}
      className={className}
    >
      {children}
    </span>
  );
};

export default PulsingText;
