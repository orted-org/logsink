import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ToastManager from "./Components/ToastManager";
import { SimaraThemeContext } from "./Components/Global/Context";
import { SimaraLightTheme } from "./Components/Global/ThemeData";

ReactDOM.render(
  <React.StrictMode>
    <SimaraThemeContext.Provider
      value={{
        themeData: SimaraLightTheme,
      }}
    >
      <ToastManager latestFirst>
        <App />
      </ToastManager>
    </SimaraThemeContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
