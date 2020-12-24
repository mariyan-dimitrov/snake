import { useState } from "react";

import Grid from "./components/common/Grid";
import useEventListener from "./components/hooks/useEventListener";

const gridSize = 10;

const App = () => {
  const initialHeadPos = {
    x: Math.floor(gridSize / 2),
    y: Math.floor(gridSize / 2),
  };

  const [snake, setSnake] = useState([
    {
      isHead: true,
      ...initialHeadPos,
    },
    {
      ...initialHeadPos,
      x: initialHeadPos.x - 1,
    },
    {
      ...initialHeadPos,
      x: initialHeadPos.x - 2,
    },
  ]);

  const goUp = () => {
    setSnake(prevState => [prevState[0].y + 1, ...prevState]);
  };

  const goDown = () => {
    setSnake(prevState => [prevState[0].y - 1, ...prevState]);
  };

  const goRight = () => {
    setSnake(prevState => [prevState[0].x + 1, ...prevState]);
  };

  const goLeft = () => {
    setSnake(prevState => [prevState[0].x - 1, ...prevState]);
  };

  const keyMap = {
    ArrowLeft: goLeft,
    ArrowDown: goRight,
    ArrowRight: goDown,
    ArrowUp: goUp,
  };

  useEventListener("keydown", e => {
    const { key } = e;
    keyMap[key] && keyMap[key]();
  });

  return <Grid snake={snake} size={gridSize} />;
};

export default App;
