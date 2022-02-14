import { Button, useMantineTheme } from "@mantine/core";
import { Observer } from "mobx-react-lite";
import styled from "styled-components";
import { IconPlus } from "../Components/Icons";
import IconWrapper from "../Components/IconWrapper";
import { useStores } from "../Logic/Providers/StoresProviders";
import ServiceCred from "./ServiceCredModal";
import ServiceDrawer from "./ServiceCEDrawer";
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
        onClick={() => {
          serviceStore.setDraftItem({
            id: "",
            name: "",
            description: "",
            createdAt: new Date(),
          });
        }}
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
      <Observer>
        {() => {
          const { draftItem } = serviceStore;
          return draftItem && <ServiceDrawer item={draftItem} />;
        }}
      </Observer>
      <ServiceCred />
    </STopBar>
  );
}

export default TopBar;
