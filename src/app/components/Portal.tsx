import React from 'react';
import ReactDOM from 'react-dom';

export const Portal: React.FC = ({ children }) => {
  const modalRoot = React.useMemo(() => document.createElement('div'), []);

  React.useEffect(() => {
    document.body.appendChild(modalRoot);
    return () => document.body.removeChild(modalRoot);
  }, [modalRoot]);

  return ReactDOM.createPortal(children, modalRoot);
};

Portal.displayName = 'Portal';