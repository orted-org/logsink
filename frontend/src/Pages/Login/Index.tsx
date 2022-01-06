import Button from "../../Components/Button";
import TextField from "../../Components/TextField";
import { FullScreen } from "../../Components/Global/Styles";

function LoginIndex() {
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
          required
          placeholder="Username"
          containerStyle={{ width: "250px" }}
        />
        <TextField
          required
          placeholder="Password"
          type="password"
          containerStyle={{ margin: "10px 0", width: "250px" }}
        />
        <Button style={{ width: "250px" }}>Login</Button>
      </form>
    </FullScreen>
  );
}

export default LoginIndex;
