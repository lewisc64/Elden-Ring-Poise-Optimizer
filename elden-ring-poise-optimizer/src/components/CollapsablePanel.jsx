import { useState } from 'react';

import './CollapsablePanel.css';

const CollapsablePanel = ({ title, collapsedByDefault, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsedByDefault);

  return (
    <div className="collapsablePanel">
      <p
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        <span className="monospaced">{isCollapsed ? '+' : '-'}</span> {title}
      </p>
      {isCollapsed ? null : children}
    </div>
  );
};

export default CollapsablePanel;
