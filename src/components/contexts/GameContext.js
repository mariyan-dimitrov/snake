import { createContext, useState, useContext, useCallback } from "react";

const defaultState = {
  wallCollision: false,
  speed: 300,
  gridSize: 15,
  gameStarted: false,
};

const GameContext = createContext(defaultState);

export const useGameContext = () => useContext(GameContext);

const GameContextProvider = ({ children }) => {
  const [state, setState] = useState(defaultState);
  const updateGameState = useCallback(
    nextState => setState(prevState => ({ ...prevState, ...nextState })),
    []
  );

  return (
    <GameContext.Provider value={{ ...state, updateGameState }}>{children}</GameContext.Provider>
  );
};

export default GameContextProvider;
