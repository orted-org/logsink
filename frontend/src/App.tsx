import { Observer } from "mobx-react-lite";
import { useStores } from "./Logic/Providers/StoresProviders";
import TopBar from "./Organs/TopBar";
import LoginIndex from "./Pages/Login/Index";
import ServiceIndex from "./Pages/Service/ServiceList/Index";

function App() {
  const { authStore } = useStores();
  return (
    <Observer>
      {() => {
        const { isLoggedIn } = authStore;
        return (
          <div>
            {isLoggedIn ? (
              <>
                <TopBar />
                <ServiceIndex />
              </>
            ) : (
              <LoginIndex />
            )}
          </div>
        );
      }}
    </Observer>
  );
}

export default App;
