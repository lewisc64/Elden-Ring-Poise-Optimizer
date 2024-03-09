import ArmorComboReadout from './ArmorComboReadout';

import './ResultsDialog.css';

const ResultsDialog = ({ combos, show, setShow }) => {
  if (show) {
    return (
      <div className="results">
        <header>
          <h1>Results</h1>
          <button
            onClick={() => {
              setShow(false);
            }}
          >
            Close
          </button>
        </header>
        {combos.length >= 1 ? (
          <ol>
            {combos.map((x) => (
              <li key={JSON.stringify(x)}>
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
