import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ToastManager from "./Components/ToastManager";
import { SimaraThemeContext } from "./Components/Global/Context";
import { SimaraLightTheme } from "./Components/Global/ThemeData";
import { StoresContext } from "./Logic/Providers/StoresProviders";
import { SService } from "./Logic/Stores/SService";
import { RService } from "./Logic/Repository/RService";

ReactDOM.render(
  <React.StrictMode>
    <StoresContext.Provider
      value={{
        serviceStore: new SService(new RService("http://localhost:4000")),
      }}
    >
      <SimaraThemeContext.Provider
        value={{
          themeData: SimaraLightTheme,
        }}
      >
        <ToastManager latestFirst>
          <App />
        </ToastManager>
      </SimaraThemeContext.Provider>
    </StoresContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
