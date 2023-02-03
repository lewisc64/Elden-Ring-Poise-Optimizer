import './Checkbox.css';

const Checkbox = ({ checked, updateChecked }) => {
  return (
    <div
      className={`checkbox ${checked ? 'active' : 'inactive'}`}
      onClick={() => {
        updateChecked(!checked);
      }}
    >
      {checked ? 'YES' : 'NO'}
    </div>
  );
};

export default Checkbox;
