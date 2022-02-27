import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import randomIntFromInterval from "../../utils/randomNumberTo";

const defaultState = {
  wallCollision: false,
  gameStarted: false,
  gamePaused: false,
  gameOver: false,
  gridSize: 15,
  speed: 300,
  food: null,
  score: 0,
  snake: [],
};

const GameContext = createContext(defaultState);

export const useGameContext = () => useContext(GameContext);

const GameContextProvider = ({ children }) => {
  const [state, setState] = useState(defaultState);
  const snakeDirectionRef = useRef("right");
  const moveSnakeIntervalRef = useRef();
  const { wallCollision, gameStarted, gameOver, gamePaused, gridSize, snake, speed, food } = state;
  const initialHeadPos = useMemo(
    () => ({
      x: Math.floor(gridSize / 2),
      y: Math.floor(gridSize / 2),
    }),
    [gridSize]
  );

  const updateGameState = useCallback(
    nextState => setState(prevState => ({ ...prevState, ...nextState })),
    []
  );

  const moveSnake = useCallback(() => {
    setState(prevState => {
      const { wallCollision, gridSize, snake } = prevState;
      let body = [...snake];
      let head = body.shift();
      const headCopy = { ...head };

      if (snakeDirectionRef.current === "left") {
        head = {
          ...head,
          x: head.x - 1,
        };
      } else if (snakeDirectionRef.current === "up") {
        head = {
          ...head,
          y: head.y - 1,
        };
      } else if (snakeDirectionRef.current === "right") {
        head = {
          ...head,
          x: head.x + 1,
        };
      } else if (snakeDirectionRef.current === "down") {
        head = {
          ...head,
          y: head.y + 1,
        };
      }

      if (!wallCollision) {
        if (head.x >= gridSize) {
          head.x = 0;
        } else if (head.x < 0) {
          head.x = gridSize;
        } else if (head.y >= gridSize) {
          head.y = 0;
        } else if (head.y < 0) {
          head.y = gridSize;
        }
      }

      let lastBodyPart = headCopy;

      body = body.map(bodyPart => {
        const bodyPartPos = lastBodyPart;
        lastBodyPart = bodyPart;

        return bodyPartPos;
      });

      const newSnake = [head, ...body];

      return {
        ...prevState,
        snake: newSnake,
      };
    });
  }, []);

  const growSnake = useCallback(() => {
    setState(prevState => {
      const snake = [...prevState.snake];
      snake.push(snake[snake.length - 1]);

      return {
        ...prevState,
        snake,
      };
    });
  }, []);

  const spawnFood = useCallback(() => {
    setState(prevState => {
      const { snake, gridSize } = prevState;
      const columnAndRow = [...Array(gridSize)];
      const gameGrid = columnAndRow.reduce((result, current, columnIndex) => {
        const tempResult = columnAndRow.map((el, rowIndex) => ({ x: columnIndex, y: rowIndex }));

        return [...result, ...tempResult];
      }, []);

      const availableSpaceForFood = gameGrid.filter(
        gameTile => !Boolean(snake.find(({ x, y }) => x === gameTile.x && y === gameTile.y))
      );

      return {
        ...prevState,
        food: availableSpaceForFood[randomIntFromInterval(0, gridSize - 1)],
      };
    });
  }, []);

  const foodConsumed = useCallback(() => {
    setState(prevState => {
      const { score, speed, gridSize } = prevState;

      return {
        ...prevState,
        score: score + speed + gridSize,
      };
    });

    growSnake();
    spawnFood();
  }, [growSnake, spawnFood]);

  const pauseGame = useCallback(() => {
    updateGameState({ gamePaused: true });
  }, [updateGameState]);

  const continueGame = useCallback(() => {
    updateGameState({ gamePaused: false });
  }, [updateGameState]);

  useEffect(() => {
    let gameOver = false;

    if (wallCollision) {
      const hasCollided = snake.find(
        ({ x, y }) => x < 0 || x >= gridSize || y < 0 || y >= gridSize
      );

      if (hasCollided) {
        gameOver = true;
      }
    }

    if (!gameOver) {
      const hasBittenItself = snake.find(({ x, y }, index) => {
        const head = snake[0];

        return index === 0 ? false : head.x === x && head.y === y;
      });

      if (hasBittenItself) {
        gameOver = true;
      }
    }

    updateGameState({ gameOver });
  }, [gridSize, snake, wallCollision, updateGameState]);

  useEffect(() => {
    const snakeHead = snake[0];

    if (snakeHead && food) {
      const hasSnakeEatenFood = snakeHead.x === food.x && snakeHead.y === food.y;

      hasSnakeEatenFood && foodConsumed();
    }
  }, [foodConsumed, snake, food]);

  useEffect(() => {
    if (!gamePaused && snake.length) {
      moveSnake();

      moveSnakeIntervalRef.current = setInterval(() => {
        moveSnake();
      }, speed);

      return () => {
        clearInterval(moveSnakeIntervalRef.current);
      };
    }
  }, [moveSnake, gamePaused, speed, snake.length]);

  const startGame = useCallback(() => {
    const snake = [
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
      {
        ...initialHeadPos,
        x: initialHeadPos.x - 2,
        y: initialHeadPos.y - 1,
      },
      {
        ...initialHeadPos,
        x: initialHeadPos.x - 2,
        y: initialHeadPos.y - 2,
      },
    ];

    updateGameState({ snake, gameOver: false });
    spawnFood();
    snakeDirectionRef.current = "right";
  }, [updateGameState, spawnFood, initialHeadPos]);

  useEffect(() => {
    gameStarted && startGame();
  }, [gameStarted, startGame]);

  useEffect(() => {
    gameOver && alert("here");
  }, [gameOver]);

  return (
    <GameContext.Provider
      value={{
        snakeDirectionRef,
        updateGameState,
        foodConsumed,
        continueGame,
        pauseGame,
        growSnake,
        startGame,
        moveSnake,
        ...state,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
