import styled from "styled-components/macro";

import {
  wallCollisionOptions,
  gridSizeOptions,
  speedOptions,
} from "../constants/gameSettingsOptions";
import { useGameContext } from "../contexts/GameContext";
import OptionChooser from "./OptionChooser";

const Settings = () => {
  const { updateGameState } = useGameContext();

  return (
    <Wrap>
      <OptionChooser title="Wall collision" value="wallCollision" options={wallCollisionOptions} />
      <OptionChooser title="Grid size" value="gridSize" options={gridSizeOptions} />
      <OptionChooser title="Speed" value="speed" options={speedOptions} />

      <Button onClick={() => updateGameState({ gameStarted: true })}>Start Game</Button>
    </Wrap>
  );
};

export default Settings;

const Wrap = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(3px);
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: green;
  color: white;
  border-radius: 4px;
  width: 150px;
  height: 50px;
  border: none;
  outline: none;
  cursor: pointer;
`;
