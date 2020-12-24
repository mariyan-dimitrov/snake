import styled from "styled-components";

const Grid = ({ children, size = 10, snake }) => {
  const rowsAndColumns = [...Array(size)];

  const findSnakePosition = (column, row) => {
    for (let index = 0; index < snake.length; index++) {
      const { x, y } = snake[index];

      if (x === column && y === row) {
        return index === 0 ? "is-head" : "is-body";
      }
    }

    return false;
  };

  return (
    <div>
      <InnerWrap>
        {rowsAndColumns.map((el, columnIndex) => (
          <Column key={`column-${columnIndex}`}>
            {rowsAndColumns.map((el, rowIndex) => (
              <Row
                className={findSnakePosition(columnIndex + 1, rowIndex + 1)}
                key={`row-${rowIndex}`}
              >
                {`${columnIndex + 1}-${rowIndex + 1}`}
              </Row>
            ))}
          </Column>
        ))}
      </InnerWrap>

      <pre>{JSON.stringify(snake, 0, 2)}</pre>
    </div>
  );
};

export default Grid;

const InnerWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 1px solid black;

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
