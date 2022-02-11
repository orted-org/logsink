import { Observer } from "mobx-react-lite";
import { useEffect } from "react";
import Badge from "../../../Components/Badge";
import Button from "../../../Components/Button";
import { FullScreen } from "../../../Components/Global/Styles";
import {
  IconPencil,
  IconStatusOnline,
  IconTrash,
} from "../../../Components/Icons";
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
            <Badge intent={"grey"}>Status</Badge>
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
                        <Button
                          key={item.id + "edit"}
                          intent="normal"
                          appearance="minimal"
                          isIconButton
                          iconAfter={IconPencil}
                        />,
                        <Button
                          key={item.id + "online_data"}
                          intent="normal"
                          appearance="minimal"
                          isIconButton
                          iconAfter={IconStatusOnline}
                        />,
                        <Button
                          key={item.id + "delete"}
                          intent="danger"
                          appearance="minimal"
                          isIconButton
                          iconAfter={IconTrash}
                          onClick={() => {
                            const confirm = window.prompt(
                              `Are you confirm to delete the service? Please type ${item.name} to delete`
                            );
                            if (confirm && confirm === item.name)
                              serviceStore.deleteService(item.id);
                          }}
                        />,
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
