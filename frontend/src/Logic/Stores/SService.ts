import { observable, action, runInAction, makeAutoObservable } from "mobx";
import MService from "../Model/MService";
import { RService } from "../Repository/RService";

export class SService {
  @observable serviceList: MService[] = [];
  @observable status: string | null = null;
  constructor(private serviceRepo: RService) {
    makeAutoObservable(this);
  }

  @action
  fetchServiceList = async () => {
    this.status = "Fetching services";
    try {
      const serviceList = await this.serviceRepo.getServiceList();
      runInAction(() => {
        this.serviceList = serviceList;
        this.status = `Fetched ${serviceList.length} items.`;
      });
    } catch (err: any) {
      runInAction(() => {
        this.status = err.message || "Failed to fetch services";
      });
    }
  };
}
