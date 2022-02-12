import React from "react";
import styled from "styled-components";
import MService from "../../../Logic/Model/MService";

const SServiceListItem = styled.tr`
  height: 40px;
  border: 1px solid white;
  text-align: center;
  font-size: small;
  transition: all 0.3s;
  box-shadow: inset 0px 0px 1px 0px white;
`;
interface ServiceListItemProps {
  service: MService;
  actions?: React.ReactNode[];
}
function ServiceListItem(props: ServiceListItemProps) {
  return (
    <SServiceListItem>
      <td>{props.service.id}</td>
      <td>{props.service.name}</td>
      <td>{props.service.description}</td>
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
