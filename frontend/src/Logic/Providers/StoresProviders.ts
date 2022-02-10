import { createContext, useContext } from "react";
import { SService } from "../Stores/SService";

interface IStoresContext {
  serviceStore: SService;
}

export const StoresContext = createContext<IStoresContext>(
  {} as IStoresContext
);

export const useStores = () => useContext(StoresContext);
