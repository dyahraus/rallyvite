// BottomActionBarContext.js
import { createContext, useContext, useState } from 'react';

const BottomActionBarContext = createContext();

export const useBottomActionBar = () => useContext(BottomActionBarContext);

export const BottomActionBarProvider = ({ children }) => {
  const [label, setLabel] = useState('Next');
  const [disabled, setDisabled] = useState(true);
  const [onClick, setOnClick] = useState(() => () => {});

  const setBottomAction = ({ label, disabled, onClick }) => {
    setLabel(label);
    setDisabled(disabled);
    setOnClick(() => onClick);
  };

  const resetBottomAction = () => {
    setLabel('');
    setDisabled(false);
    setOnClick(() => () => {});
  };

  return (
    <BottomActionBarContext.Provider
      value={{
        label,
        disabled,
        onClick,
        setBottomAction,
        resetBottomAction,
      }}
    >
      {children}
    </BottomActionBarContext.Provider>
  );
};
