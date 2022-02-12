import { Button, Drawer, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import styled from "styled-components";
import { IconPlus } from "../Components/Icons";
import IconWrapper from "../Components/IconWrapper";
import { useStores } from "../Logic/Providers/StoresProviders";
import ServiceDrawer from "./ServiceDrawer";
const STopBar = styled.div`
  height: fit-content;
  min-height: 60px;
  display: flex;
  background: ${(p) => p.theme.bg};
  padding: 0 10px;
  justify-content: flex-end;
  align-items: center;
`;
function TopBar() {
  const theme = useMantineTheme();
  const { authStore } = useStores();
  const { serviceStore } = useStores();
  return (
    <STopBar theme={{ bg: theme.colors.gray[8] }}>
      <Button
        rightIcon={<IconWrapper>{IconPlus}</IconWrapper>}
        style={{ marginRight: "10px" }}
        onClick={() => serviceStore.showServiceDrawer(true)}
      >
        New Service
      </Button>
      <Button
        color={"red"}
        variant="outline"
        onClick={() => {
          authStore.logout();
        }}
      >
        Logout
      </Button>
      <ServiceDrawer />
    </STopBar>
  );
}

export default TopBar;
