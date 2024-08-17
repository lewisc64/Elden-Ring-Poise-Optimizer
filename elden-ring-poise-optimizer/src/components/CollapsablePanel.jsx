import { useState } from 'react';
import { css } from '@emotion/react';

const CollapsablePanel = ({
  title,
  collapsedByDefault,
  className,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsedByDefault);

  return (
    <div>
      <p
        css={css`
          user-select: none;
          cursor: pointer;
          background-color: #444;
          padding: 0.5rem;
        `}
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        <span
          css={css`
            font-family: monospace;
          `}
        >
          {isCollapsed ? '+' : '-'}
        </span>{' '}
        {title}
      </p>
      <div className={className}>{isCollapsed ? null : children}</div>
    </div>
  );
};

export default CollapsablePanel;
