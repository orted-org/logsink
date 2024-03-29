import React, { ButtonHTMLAttributes, useMemo } from "react";
import styled from "styled-components";
import { useSimara } from "./Global/Context";
import { ISimaraThemeData } from "./Global/Interface";
import { ComponentIntent, ComponentSize } from "./Global/Type";
import IconWrapper from "./IconWrapper";
import Spinner from "./Spinner";
const SButton = styled.button`
  background: ${(p) => p.theme.backgroundColor};
  color: ${(p) => p.theme.internalColor};
  height: ${(p) => p.theme.height + "px"};
  min-width: ${(p) => p.theme.height + 1.5 + "px"};
  padding: ${(p) =>
    p.theme.height * 0.05 + "px " + p.theme.height * 0.2 + "px"};
  font-size: ${(p) => p.theme.height / 3 + "px"};
  font-weight: 500;
  border-radius: ${(p) => p.theme.borderRadius + "px"};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid ${(p) => p.theme.borderColor};
  outline: none;
  transition: all 0.1s;
  &:hover {
    filter: brightness(120%);
  }
  &:disabled {
    filter: brightness(100%);
    cursor: not-allowed;
  }
  &:active {
    filter: brightness(60%);
  }
`;
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: "primary" | "secondary" | "minimal";
  intent?: ComponentIntent;
  cSize?: ComponentSize;
  isDisabled?: boolean;
  iconAfter?: JSX.Element;
  iconBefore?: JSX.Element;
  isLoading?: boolean;
  children?: React.ReactNode;
  isIconButton?: boolean;
  isShrunken?: boolean;
}

function getButtonTheme(p: ButtonProps, baseTheme: ISimaraThemeData): any {
  const Colors = baseTheme.Colors;
  let theme = p.isDisabled ? Colors.grey : Colors.primary;
  let backgroundColor = theme.dil0;
  let borderColor = theme.dil60;
  let internalColor = "white";
  let height = baseTheme.MediumHeight;
  switch (p.cSize) {
    case "small":
      height = baseTheme.SmallHeight;
      break;
    case "large":
      height = baseTheme.LargeHeight;
      break;
  }
  if (!p.isDisabled) {
    switch (p.intent) {
      case "success":
        theme = Colors.success;
        backgroundColor = theme.dil0;
        borderColor = theme.dil60;
        break;
      case "danger":
        theme = Colors.danger;
        backgroundColor = theme.dil0;
        borderColor = theme.dil60;
        break;
    }
  }
  switch (p.appearance) {
    case "secondary":
      internalColor = theme.dil0;
      backgroundColor = "transparent";
      borderColor = theme.dil60;
      break;
    case "minimal":
      internalColor = theme.dil0;
      backgroundColor = "transparent";
      borderColor = backgroundColor;
      break;
  }
  return {
    backgroundColor,
    borderColor,
    internalColor,
    height,
    borderRadius: baseTheme.BorderRadius,
  };
}

export default function Button(props: ButtonProps) {
  const simaraTheme = useSimara();
  const buttonTheme = useMemo(
    () => getButtonTheme(props, simaraTheme),
    [props, simaraTheme]
  );

  return (
    <SButton
      theme={buttonTheme}
      disabled={props.isDisabled}
      onClick={props.onClick}
      {...props}
      style={{
        padding: props.isIconButton ? 0 : "",
        height: props.isShrunken ? "fit-content" : "",
        width: props.isShrunken ? "fit-content" : "",
        ...props.style,
      }}
    >
      {props.isLoading ? (
        <Spinner color={buttonTheme.internalColor} cSize={props.cSize} />
      ) : (
        <>
          {props.iconBefore && (
            <IconWrapper
              cSize={props.cSize}
              color={buttonTheme.internalColor}
              style={{
                marginRight: props.isIconButton
                  ? 0
                  : buttonTheme.height / 2.5 + "px",
              }}
            >
              {props.iconBefore}
            </IconWrapper>
          )}
          {!props.isIconButton && props.children}
          {props.iconAfter && (
            <IconWrapper
              cSize={props.cSize}
              color={buttonTheme.internalColor}
              style={{
                marginLeft: props.isIconButton
                  ? 0
                  : buttonTheme.height / 2.5 + "px",
              }}
            >
              {props.iconAfter}
            </IconWrapper>
          )}
        </>
      )}
    </SButton>
  );
}
