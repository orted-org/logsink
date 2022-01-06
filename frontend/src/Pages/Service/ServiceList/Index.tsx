import Button from "../../../Components/Button";
import { FullScreen } from "../../../Components/Global/Styles";
import {
  IconDatabase,
  IconPencil,
  IconStatusOnline,
  IconTrash,
} from "../../../Components/Icons";
import { IService } from "../../../TI/Interfaces";
import ServiceListItem from "./ListItem";

function ServiceListIndex() {
  const services: IService[] = [
    {
      id: "9023l2390asdf",
      name: "saarans_producer",
      description:
        "This service is responsible for serving endpoints to create news. ",
      created_at: new Date(),
    },
    {
      id: "9023l2390asdf",
      name: "saarans_producer",
      description:
        "This service is responsible for serving endpoints to create news. ",
      created_at: new Date(),
    },
    {
      id: "9023l2390asdf",
      name: "saarans_producer",
      description:
        "This service is responsible for serving endpoints to create news. ",
      created_at: new Date(),
    },
  ];
  return (
    <FullScreen style={{ marginTop: "10px", height: "fit-content" }}>
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
        {services.map((item, index) => {
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
}

export default ServiceListIndex;
