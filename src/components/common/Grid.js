import styled from "styled-components/macro";
import cn from "classnames";

import { useGameContext } from "../contexts/GameContext";

const Grid = ({ children }) => {
  const { snakeDirectionRef, wallCollision, gridSize, snake, food } = useGameContext();

  const rowsAndColumns = [...Array(gridSize)];

  const getBodyCurveClassNames = (currentPart, prevPart, nextPart) => {
    let classNames = [];

    if (currentPart.x === prevPart.x && currentPart.x === nextPart.x) {
      classNames.push(["vertical"]);
    } else if (currentPart.y === prevPart.y && currentPart.y === nextPart.y) {
      classNames.push(["horizontal"]);
    } else if (currentPart.x === prevPart.x || currentPart.x === nextPart.x) {
      if (currentPart.x + 1 === nextPart.x || currentPart.x + 1 === prevPart.x) {
        classNames.push("right");
      } else if (currentPart.x - 1 === nextPart.x || currentPart.x - 1 === prevPart.x) {
        classNames.push("left");
      }

      if (currentPart.y + 1 === nextPart.y || currentPart.y + 1 === prevPart.y) {
        classNames.push("down");
      } else if (currentPart.y - 1 === nextPart.y || currentPart.y - 1 === prevPart.y) {
        classNames.push("up");
      }
    }

    return classNames;
  };

  const getTailCurveClassNames = (currentPart, prevPart, nextPart) => {
    let classNames = [];

    if (currentPart.x === prevPart.x && currentPart.x === nextPart.x) {
      classNames.push(["vertical"]);
    } else if (currentPart.y === prevPart.y && currentPart.y === nextPart.y) {
      classNames.push(["horizontal"]);
    }

    if (currentPart.x + 1 === nextPart.x || currentPart.x + 1 === prevPart.x) {
      classNames.push("right");
    } else if (currentPart.x - 1 === nextPart.x || currentPart.x - 1 === prevPart.x) {
      classNames.push("left");
    }

    if (currentPart.y + 1 === nextPart.y || currentPart.y + 1 === prevPart.y) {
      classNames.push("down");
    } else if (currentPart.y - 1 === nextPart.y || currentPart.y - 1 === prevPart.y) {
      classNames.push("up");
    }

    return classNames;
  };

  const findSnakePosition = (column, row) => {
    for (let index = 0; index < snake.length; index++) {
      const currentPart = snake[index];
      const { x, y } = currentPart;

      if (y === column && x === row) {
        const isHead = index === 0;

        if (isHead) {
          return cn("is-head", `${snakeDirectionRef.current}-direction`);
        }

        const isTail = index === snake.length - 1;

        if (isTail) {
          return cn(
            "is-tail",
            ...getTailCurveClassNames(currentPart, snake[index - 1], snake[index - 1])
          );
        }

        return cn(
          "is-body",
          ...getBodyCurveClassNames(currentPart, snake[index - 1], snake[index + 1])
        );
      }
    }

    return false;
  };

  const findFoodPosition = (column, row) => {
    const { x, y } = food || {};

    if (y === column && x === row) {
      return "is-food";
    }

    return false;
  };

  return (
    <Wrap>
      <GridPlayground
        className={cn({
          "has-collision": wallCollision,
        })}
        gridSize={gridSize}
      >
        {rowsAndColumns.map((el, columnIndex) =>
          rowsAndColumns.map((el, rowIndex) => (
            <Box
              className={cn(
                findSnakePosition(columnIndex, rowIndex),
                findFoodPosition(columnIndex, rowIndex)
              )}
              key={`row-${rowIndex}`}
            >
              {/* {process.env.NODE_ENV === "development" && `${columnIndex}-${rowIndex}`} */}
            </Box>
          ))
        )}
      </GridPlayground>

      {children}

      {/* {process.env.NODE_ENV === "development" && <pre>{JSON.stringify(snake, 0, 2)}</pre>} */}
    </Wrap>
  );
};

export default Grid;

const Wrap = styled.div`
  position: relative;
`;

const GridPlayground = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(${({ gridSize }) => gridSize}, 1fr);
  grid-template-rows: repeat(${({ gridSize }) => gridSize}, 1fr);
  border: 1px solid black;
  align-items: stretch;

  &.has-collision {
    border-color: red;
  }
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: transparent;
  overflow: hidden;

  &.is-head {
    background: url(http://localhost:3000/visuals/snake.png) 100% 33.4%;
    background-repeat: no-repeat;
    background-size: 500%;

    &.right-direction {
      background: url(http://localhost:3000/visuals/snake.png) 100% 0%;
      background-repeat: no-repeat;
      background-size: 500%;
    }

    &.left-direction {
      background: url(http://localhost:3000/visuals/snake.png) 75% 33.3%;
      background-repeat: no-repeat;
      background-size: 500%;
    }

    &.up-direction {
      background: url(http://localhost:3000/visuals/snake.png) 75% 0%;
      background-repeat: no-repeat;
      background-size: 500%;
    }
  }

  &.is-body {
    background: url(http://localhost:3000/visuals/snake.png) 0% 0%;
    background-repeat: no-repeat;
    background-size: 500%;

    &.down.left {
      background: url(http://localhost:3000/visuals/snake.png) 50% 0%;
      background-size: 500%;
      background-repeat: no-repeat;
    }

    &.up.right {
      background: url(http://localhost:3000/visuals/snake.png) 0% 33%;
      background-size: 500%;
      background-repeat: no-repeat;
    }

    &.up.left {
      background: url(http://localhost:3000/visuals/snake.png) 50% 66.5%;
      background-size: 500%;
      background-repeat: no-repeat;
    }

    &.horizontal {
      background: url(http://localhost:3000/visuals/snake.png) 26% 0%;
      background-size: 500%;
      background-repeat: no-repeat;
    }

    &.vertical {
      background: url(http://localhost:3000/visuals/snake.png) 50% 33%;
      background-size: 500%;
      background-repeat: no-repeat;
    }
  }

  &.is-tail {
    &.horizontal {
      background: url(http://localhost:3000/visuals/snake.png) 100% 66.6%;
      background-repeat: no-repeat;
      background-size: 500%;

      &.left {
        background: url(http://localhost:3000/visuals/snake.png) 75% 100%;
        background-repeat: no-repeat;
        background-size: 500%;
      }
    }

    &.vertical {
      background: url(http://localhost:3000/visuals/snake.png) 75% 68%;
      background-repeat: no-repeat;
      background-size: 500%;

      &.down {
        background: url(http://localhost:3000/visuals/snake.png) 100% 100%;
        background-repeat: no-repeat;
        background-size: 500%;
      }
    }
  }

  &.is-food {
    background: url(http://localhost:3000/visuals/snake.png) 0% 100%;
    background-repeat: no-repeat;
    background-size: 500%;
  }
`;
