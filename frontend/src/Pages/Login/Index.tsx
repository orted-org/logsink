import Button from "../../Components/Button";
import TextField from "../../Components/TextField";
import { FullScreen } from "../../Components/Global/Styles";
import { useEffect, useState } from "react";
import { MAuthCredentials } from "../../Logic/Model/MAuth";
import { useStores } from "../../Logic/Providers/StoresProviders";
import { Observer } from "mobx-react-lite";

function LoginIndex() {
  const [cred, setCred] = useState<MAuthCredentials>({
    username: "",
    password: "",
  });
  const { authStore } = useStores();
  useEffect(() => {
    authStore.login(cred);
  }, []);
  return (
    <Observer>
      {() => {
        const { status } = authStore;
        return (
          <FullScreen
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <form
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <TextField
                value={cred.username}
                onChange={(e) => {
                  setCred((ps) => {
                    return { ...ps, username: e.target.value };
                  });
                }}
                required
                placeholder="Username"
                containerStyle={{ width: "250px" }}
              />
              <TextField
                value={cred.password}
                onChange={(e) => {
                  setCred((ps) => {
                    return { ...ps, password: e.target.value };
                  });
                }}
                required
                placeholder="Password"
                type="password"
                containerStyle={{ margin: "10px 0", width: "250px" }}
              />
              <Button
                style={{ width: "250px" }}
                onClick={(e) => {
                  e.preventDefault();
                  authStore.login(cred);
                }}
              >
                Login
              </Button>
              <p>{status}</p>
            </form>
          </FullScreen>
        );
      }}
    </Observer>
  );
}

export default LoginIndex;
