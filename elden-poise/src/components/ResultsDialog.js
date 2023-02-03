import ArmorComboReadout from './ArmorComboReadout';

import './ResultsDialog.css';

const ResultsDialog = ({ combos, show, setShow }) => {
  if (show) {
    return (
      <div className="results">
        <button
          onClick={() => {
            setShow(false);
          }}
        >
          Close
        </button>
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
