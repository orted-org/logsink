import React from "react";
import styled from "styled-components";
import Button from "../Components/Button";
import { SimaraLightTheme } from "../Components/Global/ThemeData";
import { IconPlus } from "../Components/Icons";
import { useStores } from "../Logic/Providers/StoresProviders";
const STopBar = styled.div`
  height: fit-content;
  min-height: 60px;
  background: ${SimaraLightTheme.Colors.grey.dil0};
  display: flex;
  padding: 0 10px;
  justify-content: flex-end;
  align-items: center;
`;
function TopBar() {
  const { authStore } = useStores();
  return (
    <STopBar>
      <Button iconAfter={IconPlus} style={{ marginRight: "10px" }}>
        New Service
      </Button>
      <Button
        intent="danger"
        onClick={() => {
          authStore.logout();
        }}
      >
        Logout
      </Button>
    </STopBar>
  );
}

export default TopBar;
