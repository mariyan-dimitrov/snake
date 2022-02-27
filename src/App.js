import styled from "styled-components/macro";

import { keyMap, opositeDirectionMap } from "./components/constants/gameHelpers";
import { useGameContext } from "./components/contexts/GameContext";
import useEventListener from "./components/hooks/useEventListener";
import Settings from "./components/common/Settings";
import Grid from "./components/common/Grid";

const App = () => {
  const { snakeDirectionRef, continueGame, gameStarted, gamePaused, pauseGame, growSnake } =
    useGameContext();

  useEventListener("keydown", ({ code }) => {
    // TODO: Rework this one
    code === "Enter" && growSnake();
    code === "Space" && gameStarted && (gamePaused ? continueGame() : pauseGame());

    const direction = keyMap[code];
    const isOppositeDirection = opositeDirectionMap[direction] !== snakeDirectionRef.current;

    if (direction && isOppositeDirection) {
      snakeDirectionRef.current = keyMap[code];
    }
  });

  return (
    <Wrap>
      <Grid>{!gameStarted && <Settings />}</Grid>
    </Wrap>
  );
};

export default App;

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
