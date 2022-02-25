import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components/macro";

import { keyMap, opositeDirectionMap } from "./components/constants/gameHelpers";
import { useGameContext } from "./components/contexts/GameContext";
import useEventListener from "./components/hooks/useEventListener";
import Settings from "./components/common/Settings";
import Grid from "./components/common/Grid";

const App = () => {
  const { gridSize, gameStarted, speed } = useGameContext();

  const initialHeadPos = useMemo(
    () => ({
      x: Math.floor(gridSize / 2),
      y: Math.floor(gridSize / 2),
    }),
    [gridSize]
  );

  const [snake, setSnake] = useState([]);
  const moveIntervalRef = useRef();
  const headDirectionRef = useRef("right");

  const startGame = useCallback(() => {
    setSnake([
      {
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
    headDirectionRef.current = "right";
  }, [initialHeadPos]);

  const move = () => {
    setSnake(prevState => {
      let body = [...prevState];
      let head = body.shift();
      const headCopy = { ...head };

      if (headDirectionRef.current === "left") {
        head = {
          ...head,
          x: head.x - 1,
        };
      } else if (headDirectionRef.current === "up") {
        head = {
          ...head,
          y: head.y - 1,
        };
      } else if (headDirectionRef.current === "right") {
        head = {
          ...head,
          x: head.x + 1,
        };
      } else if (headDirectionRef.current === "down") {
        head = {
          ...head,
          y: head.y + 1,
        };
      }

      let lastBodyPart = headCopy;

      body = body.map(bodyPart => {
        const bodyPartPos = lastBodyPart;
        lastBodyPart = bodyPart;

        return { ...bodyPartPos };
      });

      return [head, ...body];
    });
  };

  const grow = () => {
    setSnake(prevState => {
      const newState = [...prevState];
      newState.push(newState[newState.length - 1]);

      return newState;
    });
  };

  useEventListener("keydown", ({ code }) => {
    // TODO: Rework this one
    code === "Enter" && grow();

    const direction = keyMap[code];
    const isOppositeDirection = opositeDirectionMap[direction] !== headDirectionRef.current;

    if (direction && isOppositeDirection) {
      headDirectionRef.current = keyMap[code];
    }
  });

  useEffect(() => {
    gameStarted && startGame();
  }, [gameStarted, startGame]);

  useEffect(() => {
    moveIntervalRef.current = setInterval(() => {
      snake.length && move();
    }, speed);

    return () => {
      clearInterval(moveIntervalRef.current);
    };
  }, [snake.length, speed]);

  return (
    <Wrap>
      <Grid snake={snake} size={gridSize}>
        {!gameStarted && <Settings />}
      </Grid>
    </Wrap>
  );
};

export default App;

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
