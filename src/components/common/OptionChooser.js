import { useState, useEffect, useRef } from "react";
import styled from "styled-components/macro";
import cn from "classnames";

import { useGameContext } from "../contexts/GameContext";

const OptionChooser = ({ options, value, title }) => {
  const { updateGameState } = useGameContext();
  const [index, setIndex] = useState(0);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    updateGameState({ [value]: optionsRef.current[index].value });
  }, [index, value, updateGameState]);

  return (
    <Wrap>
      <Title>{title}</Title>
      <InnerWrap>
        <Arrow
          className={cn("is-left", {
            "is-disabled": index === 0,
          })}
          onClick={() => setIndex(Math.max(0, index - 1))}
        />
        <CurrentOption>{options[index].label}</CurrentOption>
        <Arrow
          className={cn("is-right", {
            "is-disabled": index === options.length - 1,
          })}
          onClick={() => setIndex(Math.min(options.length - 1, index + 1))}
        />
      </InnerWrap>
    </Wrap>
  );
};

export default OptionChooser;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InnerWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  text-align: center;
`;

const Arrow = styled.div`
  border: 10px solid;

  &.is-left {
    border-color: transparent red transparent transparent;
  }

  &.is-right {
    border-color: transparent transparent transparent red;
  }

  &.is-disabled {
    &.is-left {
      border-color: transparent grey transparent transparent;
    }

    &.is-right {
      border-color: transparent transparent transparent grey;
    }
  }
`;

const CurrentOption = styled.div`
  margin: 0 16px;
`;
