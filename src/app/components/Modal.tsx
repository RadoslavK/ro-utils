import React from 'react';
import { css } from '@emotion/core';

type Props = {
  readonly onClose: () => void;
};

const rootCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const contentCss = css`
  position: relative;
  background: white;
  border-radius: 2px;
  padding: 15px;
  min-width: 320px;
  max-width: 600px;
  max-height: 600px;
  z-index: 10;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 100px;
`;

const backgroundCss = css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: black;
  opacity: 0.5;
`;

export const Modal: React.FC<Props> = (props) => {
  const { children, onClose } = props;

  return (
    <>
      <div css={rootCss}>
        <div css={contentCss}>
          {children}
        </div>
      </div>
      <div
        css={backgroundCss}
        onClick={onClose}
      />
    </>
  );
};

Modal.displayName = 'Modal';