import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ToastManager from "./Components/ToastManager";
import { SimaraThemeContext } from "./Components/Global/Context";
import { SimaraLightTheme } from "./Components/Global/ThemeData";
import { StoresContext } from "./Logic/Providers/StoresProviders";
import { SService } from "./Logic/Stores/SService";
import { RService } from "./Logic/Repository/RService";
import { SAuth } from "./Logic/Stores/SAuth";
import { RAuth } from "./Logic/Repository/RAuth";
import { MantineProvider } from "@mantine/core";
const API_BASE_URL = "/api";
ReactDOM.render(
  <React.StrictMode>
    <StoresContext.Provider
      value={{
        serviceStore: new SService(new RService(API_BASE_URL)),
        authStore: new SAuth(new RAuth(API_BASE_URL)),
      }}
    >
      <SimaraThemeContext.Provider
        value={{
          themeData: SimaraLightTheme,
        }}
      >
        <ToastManager latestFirst>
          <MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles>
            <App />
          </MantineProvider>
        </ToastManager>
      </SimaraThemeContext.Provider>
    </StoresContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
