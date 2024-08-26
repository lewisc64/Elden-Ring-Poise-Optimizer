import { css } from '@emotion/react';
import PulsingText from './PulsingText';

const CombinationsProgress = ({ processed, total }) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        row-gap: 0.5rem;
      `}
    >
      <PulsingText
        css={css`
          display: grid;
          grid-template-columns: 1fr;
          justify-items: center;
        `}
      >
        <span>
          Processing combinations...{' '}
          {total > 0 ? ((processed * 100) / total).toFixed(1) : '0.0'}%
        </span>
        <span
          css={css`
            font-size: 0.8rem;
          `}
        >
          ({processed.toLocaleString()}/{total.toLocaleString()})
        </span>
      </PulsingText>
      <progress
        css={css`
          width: 100%;
        `}
        value={processed}
        max={total}
      />
    </div>
  );
};

export default CombinationsProgress;
