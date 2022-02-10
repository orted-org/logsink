import React from "react";
import styled from "styled-components";
import { SimaraLightTheme } from "../../../Components/Global/ThemeData";
import MService from "../../../Logic/Model/MService";

const SServiceListItem = styled.tr`
  height: 40px;
  border: 1px solid white;
  text-align: center;
  cursor: pointer;
  font-size: small;
  transition: all 0.3s;
  &:hover {
    box-shadow: inset 0px 0px 1px 1px ${SimaraLightTheme.Colors.primary.dil60};
  }
`;
interface ServiceListItemProps {
  service: MService;
  actions?: React.ReactNode[];
}
function ServiceListItem(props: ServiceListItemProps) {
  return (
    <SServiceListItem>
      <td style={{ color: SimaraLightTheme.Colors.primary.dil0 }}>
        {props.service.id}
      </td>
      <td>{props.service.name}</td>
      <td style={{ color: SimaraLightTheme.Colors.text.dil60 }}>
        {props.service.description}
      </td>
      <td>{props.service.createdAt.toLocaleString()}</td>
      {props.actions && (
        <td>
          {props.actions.map((item, index) => {
            return item;
          })}
        </td>
      )}
    </SServiceListItem>
  );
}

export default ServiceListItem;
