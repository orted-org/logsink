import { InputWrapper, Modal, TextInput } from "@mantine/core";
import { Observer } from "mobx-react-lite";
import React, { useState } from "react";
import { IconEye, IconEyeOff } from "../Components/Icons";
import IconWrapper from "../Components/IconWrapper";
import { useStores } from "../Logic/Providers/StoresProviders";

export default function ServiceCred() {
  const { serviceStore } = useStores();
  const [isVis, setIsVis] = useState(false);
  return (
    <Observer>
      {() => {
        const { serviceCred } = serviceStore;
        return (
          <Modal
            opened={serviceCred != null}
            onClose={() => {
              serviceStore.serviceCred = null;
            }}
            title="Service Credentials"
          >
            <p>
              Both of the following values are required to connect to the sink
              server.
            </p>
            <InputWrapper label="API ID" style={{ marginTop: "10px" }}>
              <TextInput defaultValue={serviceCred?.id} />
            </InputWrapper>
            <InputWrapper
              label="API Secret"
              style={{ marginTop: "10px" }}
              error="Please copy API Secret, this would not be visible later."
            >
              <TextInput
                value={!isVis ? "*************" : serviceCred?.secret}
                rightSection={
                  <IconWrapper
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setIsVis((ps) => !ps);
                    }}
                  >
                    {!isVis ? IconEye : IconEyeOff}
                  </IconWrapper>
                }
              />
            </InputWrapper>
          </Modal>
        );
      }}
    </Observer>
  );
}
