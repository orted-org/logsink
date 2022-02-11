import { createContext, useContext } from "react";
import { SAuth } from "../Stores/SAuth";
import { SService } from "../Stores/SService";

interface IStoresContext {
  serviceStore: SService;
  authStore: SAuth;
}

export const StoresContext = createContext<IStoresContext>(
  {} as IStoresContext
);

export const useStores = () => useContext(StoresContext);
