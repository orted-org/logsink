import { useObserver } from "mobx-react-lite";
import { useEffect } from "react";
import Button from "../../../Components/Button";
import { FullScreen } from "../../../Components/Global/Styles";
import {
  IconDatabase,
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

  return useObserver(() => {
    const { serviceList, status } = serviceStore;
    return (
      <FullScreen style={{ marginTop: "10px", height: "fit-content" }}>
        <p>Status: {status}</p>
        <table
          style={{
            width: "100%",
          }}
        >
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Created At</th>
          <th>Actions</th>
          {serviceList.map((item, index) => {
            return (
              <ServiceListItem
                key={item.id}
                service={item}
                actions={[
                  <Button
                    intent="normal"
                    appearance="minimal"
                    isIconButton
                    iconAfter={IconPencil}
                  />,
                  <Button
                    intent="normal"
                    appearance="minimal"
                    isIconButton
                    iconAfter={IconStatusOnline}
                  />,
                  <Button
                    intent="normal"
                    appearance="minimal"
                    isIconButton
                    iconAfter={IconDatabase}
                  />,
                  <Button
                    intent="danger"
                    appearance="minimal"
                    isIconButton
                    iconAfter={IconTrash}
                  />,
                ]}
              />
            );
          })}
        </table>
      </FullScreen>
    );
  });
}

export default ServiceListIndex;
