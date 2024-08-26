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
    <div
      css={css`
        display: grid;
        transition: grid-template-rows 0.2s ease-in;
      `}
      style={{
        gridTemplateRows: isCollapsed ? 'min-content 0fr' : 'min-content 1fr',
      }}
      className={className}
    >
      <p
        css={css`
          user-select: none;
          cursor: pointer;
          background-color: #444;
          margin: 0;
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
      <div
        css={css`
          background-color: var(--panel-background-color);
          overflow: hidden;
        `}
      >
        <div
          css={css`
            padding: 1rem;
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsablePanel;
