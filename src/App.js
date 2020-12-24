import { useState, useRef, useEffect } from "react";

import Grid from "./components/common/Grid";
import useEventListener from "./components/hooks/useEventListener";

const gridSize = 10;

const keyMap = {
  ArrowLeft: "left",
  ArrowDown: "down",
  ArrowRight: "right",
  ArrowUp: "up",
};

const opositeDirectionMap = {
  left: "right",
  right: "left",
  up: "down",
  down: "up",
};

const App = () => {
  const initialHeadPos = {
    x: Math.floor(gridSize / 2),
    y: Math.floor(gridSize / 2),
  };

  const [snake, setSnake] = useState([]);
  const moveIntervalRef = useRef();
  const headDirectionRef = useRef("right");

  const startGame = () => {
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
  };

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
          y: head.y + 1,
        };
      } else if (headDirectionRef.current === "right") {
        head = {
          ...head,
          x: head.x + 1,
        };
      } else if (headDirectionRef.current === "down") {
        head = {
          ...head,
          y: head.y - 1,
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

  useEventListener("keydown", e => {
    const { code } = e;

    // TODO: Rework this one
    if (code === "Space") {
      startGame();
    }

    if (code === "Enter") {
      grow();
    }

    const direction = keyMap[code];

    if (direction && opositeDirectionMap[direction] !== headDirectionRef.current) {
      headDirectionRef.current = keyMap[code];
    }
  });

  useEffect(() => {
    moveIntervalRef.current = setInterval(() => {
      snake.length && move();
    }, 1000);

    return () => {
      clearInterval(moveIntervalRef.current);
    };
  }, [snake.length]);

  return <Grid snake={snake} size={gridSize} />;
};

export default App;
