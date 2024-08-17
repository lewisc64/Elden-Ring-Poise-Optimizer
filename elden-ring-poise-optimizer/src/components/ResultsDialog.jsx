import { css } from '@emotion/react';
import ArmorComboReadout from './ArmorComboReadout';
import Button from './Button';

const ResultsDialog = ({ combos, show, setShow }) => {
  if (show) {
    return (
      <div
        css={css`
          position: fixed;
          top: 6rem;
          left: 6rem;
          width: 30rem;
          height: calc(100vh - 12rem);
          overflow-y: scroll;
          background-color: #222;
          filter: drop-shadow(0px 0px 20px black);
          @media (width < 650px) {
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        `}
      >
        <header
          css={css`
            top: 0;
            position: sticky;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0;
            background-color: rgba(16, 16, 16, 0.5);
            padding: 1rem;
          `}
        >
          <h1
            css={css`
              margin: 0;
            `}
          >
            Results
          </h1>
          <Button
            css={css`
              background-color: var(--negative-control-background-color);
              color: #eee;
              margin: 0;
            `}
            onClick={() => {
              setShow(false);
            }}
          >
            Close
          </Button>
        </header>
        {combos.length >= 1 ? (
          <ol>
            {combos.map((x) => (
              <li
                css={css`
                  margin-bottom: 1rem;
                  &::marker {
                    font-size: 1.2rem;
                  }
                `}
                key={JSON.stringify(x)}
              >
                <ArmorComboReadout combo={x} />
              </li>
            ))}
          </ol>
        ) : (
          <p>There are no possible combinations.</p>
        )}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ResultsDialog;
