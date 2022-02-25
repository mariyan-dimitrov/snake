import ReactDOM from "react-dom";

import GameContextProvider from "./components/contexts/GameContext";
import App from "./App";

ReactDOM.render(
  <GameContextProvider>
    <App />
  </GameContextProvider>,
  document.getElementById("root")
);
