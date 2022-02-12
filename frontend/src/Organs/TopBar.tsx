import { Button, useMantineTheme } from "@mantine/core";
import styled from "styled-components";
import { IconPlus } from "../Components/Icons";
import IconWrapper from "../Components/IconWrapper";
import { useStores } from "../Logic/Providers/StoresProviders";
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
  return (
    <STopBar theme={{ bg: theme.colors.gray[8] }}>
      <Button
        rightIcon={<IconWrapper>{IconPlus}</IconWrapper>}
        style={{ marginRight: "10px" }}
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
    </STopBar>
  );
}

export default TopBar;
