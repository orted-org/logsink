import {
  Drawer,
  TextInput,
  Textarea,
  InputWrapper,
  Button,
} from "@mantine/core";
import { Observer } from "mobx-react-lite";
import { useStores } from "../Logic/Providers/StoresProviders";

function ServiceDrawer() {
  const { serviceStore } = useStores();
  return (
    <Observer>
      {() => {
        const { draftItem } = serviceStore;
        if (!draftItem) {
          return <></>;
        }
        return (
          <Drawer
            opened={serviceStore.draftItem !== null}
            onClose={() => {
              serviceStore.draftItem = null;
            }}
            title={draftItem.id !== "" ? "Edit Service" : "New Service"}
            padding="xl"
            size="xl"
          >
            <InputWrapper required label="Name">
              <TextInput
                value={draftItem.name}
                onChange={(e) => {
                  draftItem.name = e.target.value;
                }}
                placeholder="Service name"
              />
            </InputWrapper>
            <InputWrapper label="Description">
              <Textarea
                value={draftItem.description}
                onChange={(e) => {
                  draftItem.description = e.target.value;
                }}
                placeholder="Service description"
              />
            </InputWrapper>
            <Button
              style={{ marginTop: "30px" }}
              onClick={() => {
                draftItem.id !== ""
                  ? serviceStore.updateService(draftItem)
                  : serviceStore.createService(draftItem);
                serviceStore.draftItem = null;
              }}
            >
              {draftItem.id !== "" ? "Save" : "Create"}
            </Button>
          </Drawer>
        );
      }}
    </Observer>
  );
}

export default ServiceDrawer;
