import { Button } from "@mantine/core";
import styled from "styled-components";
import { SimaraLightTheme } from "../Components/Global/ThemeData";
import { IconPlus } from "../Components/Icons";
import IconWrapper from "../Components/IconWrapper";
import { useStores } from "../Logic/Providers/StoresProviders";
const STopBar = styled.div`
  height: fit-content;
  min-height: 60px;
  border-bottom: 0.2px solid gray;
  display: flex;
  padding: 0 10px;
  justify-content: flex-end;
  align-items: center;
`;
function TopBar() {
  const { authStore } = useStores();
  return (
    <STopBar>
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
