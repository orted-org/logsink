import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useSimara } from "./Global/Context";
import { ISimaraThemeData } from "./Global/Interface";
import {
  IconCheckCircleFilled,
  IconExclamationCircleFilled,
  IconExclamationFilled,
  IconInformationCircle,
  IconX,
} from "./Icons";
import IconWrapper from "./IconWrapper";

const STC = styled.div`
  box-sizing: border-box;
  max-width: 100%;
  width: 400px;
  min-height: 70px;
  height: fit-content;
  border-radius: ${(p) => p.theme.borderRadius + "px"};
  border-left: solid 5px ${(p) => p.theme.intentColor};
  background: ${(p) => p.theme.background};
  overflow: hidden;
  padding: 10px;
  display: flex;
  margin-top: 10px;
  font-size: small;
  translate: all 0.3s;
  box-shadow: ${(p) => p.theme.boxShadow.largeScreen};
  z-index: 98;
  transition: all 0.3s;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
      ${(p) => p.theme.intentColor} 0px 0px 0px 1px inset;
  }
  @media (max-width: 480px) {
    box-shadow: ${(p) => p.theme.boxShadow.smallScreen};
    border-left: none;
    border-bottom: solid 5px ${(p) => p.theme.intentColor};
  }
`;
function getToastTheme(p: ToastProps, baseTheme: ISimaraThemeData) {
  let intentColor = baseTheme.Colors.primary.dil0;
  let icon = IconInformationCircle;

  switch (p.intent) {
    case "danger":
      intentColor = baseTheme.Colors.danger.dil0;
      icon = IconExclamationCircleFilled;
      break;
    case "success":
      intentColor = baseTheme.Colors.success.dil0;
      icon = IconCheckCircleFilled;
      break;
    case "warning":
      intentColor = baseTheme.Colors.warning.dil0;
      icon = IconExclamationFilled;
      break;
  }
  return {
    intentColor,
    borderRadius: baseTheme.BorderRadius,
    icon,
    background: baseTheme.Colors.secBackground,
    boxShadow: {
      largeScreen: "2px 2px 5px 2px #00000047",
      smallScreen: "0px 2px 5px 2px #00000047",
    },
  };
}

interface ToastProps {
  intent?: "info" | "danger" | "success" | "warning";
  title?: string;
  message: React.ReactNode;
  customIcon?: JSX.Element;
  duration?: number;
  onClose: () => void;
  id: string;
  style?: React.CSSProperties;
}
function Toast(props: ToastProps) {
  const simara = useSimara();
  const toastTheme = useMemo(
    () => getToastTheme(props, simara),
    [props, simara]
  );

  let shouldClose = true;
  useEffect(() => {
    const duration = props.duration || simara.AlertDuration;
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      if (shouldClose) props.onClose && props.onClose();
    }, duration);
  }, [props, props.duration, shouldClose, simara.AlertDuration]);
  return (
    <STC
      theme={toastTheme}
      onMouseEnter={() => {
        shouldClose = false;
      }}
    >
      <IconWrapper
        color={toastTheme.intentColor}
        cSize="large"
        style={{
          borderRadius: "50%",
          flex: "0 0 auto",
          margin: "auto",
          padding: "5px 10px",
        }}
      >
        {toastTheme.icon}
      </IconWrapper>
      <div style={{ flex: "1 1 auto", margin: "auto" }}>
        <b
          style={{
            color: simara.Colors.text.dil0,
            fontSize: "0.9rem",
            padding: "0",
            margin: "0",
            fontWeight: 700,
          }}
        >
          {props.title}
        </b>
        <p
          style={{
            padding: "0",
            margin: "0",
            color: simara.Colors.text.dil60,
          }}
        >
          {props.message}
        </p>
      </div>
      <div onClick={props.onClose}>
        <IconWrapper
          color={simara.Colors.text.dil0}
          cSize="small"
          style={{
            borderRadius: "50%",
            flex: "0 0 auto",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          {IconX}
        </IconWrapper>
      </div>
    </STC>
  );
}

export default Toast;
