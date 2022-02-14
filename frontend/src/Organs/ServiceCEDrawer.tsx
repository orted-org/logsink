import {
  Drawer,
  TextInput,
  Textarea,
  InputWrapper,
  Button,
} from "@mantine/core";
import { useState } from "react";
import MService from "../Logic/Model/MService";
import { useStores } from "../Logic/Providers/StoresProviders";

interface ServiceCEDrawerProps {
  item: MService;
}
function ServiceCEDrawer(props: ServiceCEDrawerProps) {
  const { serviceStore } = useStores();
  const [draftItem, setDraftItem] = useState(props.item);
  if (!draftItem) {
    return <></>;
  }
  return (
    <Drawer
      opened={true}
      onClose={() => {
        serviceStore.setDraftItem(null);
      }}
      title={draftItem.id !== "" ? "Edit Service" : "New Service"}
      padding="xl"
      size="xl"
    >
      <InputWrapper required label="Name">
        <TextInput
          value={draftItem.name}
          onChange={(e) => {
            setDraftItem((ps) => {
              return { ...ps, name: e.target.value };
            });
          }}
          placeholder="Service name"
        />
      </InputWrapper>
      <InputWrapper label="Description">
        <Textarea
          value={draftItem.description}
          onChange={(e) => {
            setDraftItem((ps) => {
              return { ...ps, description: e.target.value };
            });
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
          serviceStore.setDraftItem(null);
        }}
      >
        {draftItem.id !== "" ? "Save" : "Create"}
      </Button>
    </Drawer>
  );
}

export default ServiceCEDrawer;
