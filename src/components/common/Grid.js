import styled from "styled-components/macro";
import cn from "classnames";

import { useGameContext } from "../contexts/GameContext";

const Grid = ({ children, size = 10, snake }) => {
  const { wallCollision } = useGameContext();

  const rowsAndColumns = [...Array(size)];

  const findSnakePosition = (column, row) => {
    for (let index = 0; index < snake.length; index++) {
      const { x, y } = snake[index];

      if (y === column && x === row) {
        return index === 0 ? "is-head" : "is-body";
      }
    }

    return false;
  };

  return (
    <Wrap>
      <GridPlayground
        className={cn({
          "has-collision": wallCollision,
        })}
        size={size}
      >
        {rowsAndColumns.map((el, columnIndex) =>
          rowsAndColumns.map((el, rowIndex) => (
            <Box className={findSnakePosition(columnIndex, rowIndex)} key={`row-${rowIndex}`}>
              {process.env.NODE_ENV === "development" && `${columnIndex}-${rowIndex}`}
            </Box>
          ))
        )}
      </GridPlayground>

      {children}

      {process.env.NODE_ENV === "development" && <pre>{JSON.stringify(snake, 0, 2)}</pre>}
    </Wrap>
  );
};

export default Grid;

const Wrap = styled.div`
  position: relative;
`;

const GridPlayground = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(${({ size }) => size}, 1fr);
  grid-template-rows: repeat(${({ size }) => size}, 1fr);
  border: 1px solid black;
  grid-gap: 1px;
  background-color: black;
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
  background: white;

  &.is-head {
    background-color: green;
  }

  &.is-body {
    background-color: blue;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column-reverse;
`;
