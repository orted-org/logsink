import { ActionIcon, Badge } from "@mantine/core";
import { Observer } from "mobx-react-lite";
import { useEffect } from "react";
import { FullScreen } from "../../../Components/Global/Styles";
import { IconPencil, IconTrash } from "../../../Components/Icons";
import IconWrapper from "../../../Components/IconWrapper";
import { useStores } from "../../../Logic/Providers/StoresProviders";
import ServiceListItem from "./ListItem";

function ServiceListIndex() {
  const { serviceStore } = useStores();
  useEffect(() => {
    serviceStore.fetchServiceList();
  }, []);

  return (
    <Observer>
      {() => {
        const { serviceList, status } = serviceStore;
        return (
          <FullScreen style={{ marginTop: "10px", height: "fit-content" }}>
            <Badge style={{ marginLeft: "10px" }}>{status}</Badge>
            <table
              style={{
                width: "100%",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {serviceList.map((item, index) => {
                  return (
                    <ServiceListItem
                      key={item.id}
                      service={item}
                      actions={[
                        <ActionIcon
                          style={{ display: "inline", marginRight: "5px" }}
                          key={item.id + "edit"}
                          variant="light"
                          onClick={() => {
                            serviceStore.setDraftItem(item);
                          }}
                        >
                          <IconWrapper>{IconPencil}</IconWrapper>
                        </ActionIcon>,
                        <ActionIcon
                          style={{ display: "inline" }}
                          key={item.id + "delete"}
                          variant="light"
                          onClick={() => {
                            const name = "Delete";
                            const confirm = window.prompt(
                              `Are you confirm to delete the service? Please type "${name}" to continue deleting the service.`
                            );
                            if (confirm && confirm === name)
                              serviceStore.deleteService(item.id);
                          }}
                        >
                          <IconWrapper>{IconTrash}</IconWrapper>
                        </ActionIcon>,
                      ]}
                    />
                  );
                })}
              </tbody>
            </table>
          </FullScreen>
        );
      }}
    </Observer>
  );
}

export default ServiceListIndex;
