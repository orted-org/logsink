import React from "react";
import Button from "../../Components/Button";
import { FullScreen } from "../../Global/Styles";

function DashboardIndex() {
  return (
    <FullScreen
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateRows: "repeat(3, 1fr)",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <Button style={{ margin: "10px" }}>Live Data</Button>
        <Button style={{ margin: "10px" }}>Old Data</Button>
        <Button style={{ margin: "10px" }}>Service Management</Button>
        <Button
          intent="danger"
          appearance="secondary"
          style={{ margin: "10px" }}
        >
          Logout
        </Button>
      </div>
    </FullScreen>
  );
}

export default DashboardIndex;
