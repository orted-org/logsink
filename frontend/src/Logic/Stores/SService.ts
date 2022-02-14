import { observable, action, runInAction, makeAutoObservable } from "mobx";
import MService from "../Model/MService";
import { RService } from "../Repository/RService";

export class SService {
  @observable serviceList: MService[] = [];
  @observable status: string | null = null;
  @observable draftItem: MService | null = null;
  @observable serviceCred: { id: string; secret: string } | null = null;
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

  @action
  createService = async (service: MService) => {
    this.status = "Creating service.";
    try {
      const res = await this.serviceRepo.createService(service);
      runInAction(() => {
        this.fetchServiceList();
        this.status = `Service created.`;
        this.serviceCred = res;
      });
    } catch (err: any) {
      runInAction(() => {
        this.status = err.message || "Failed to create service.";
      });
    }
  };

  @action
  updateService = async (service: MService) => {
    this.status = "Updating service.";
    try {
      await this.serviceRepo.updateService(service);
      runInAction(() => {
        this.fetchServiceList();
        this.status = `Service updated.`;
      });
    } catch (err: any) {
      runInAction(() => {
        this.status = err.message || "Failed to update service.";
      });
    }
  };

  @action
  deleteService = async (id: string) => {
    this.status = "Deleting services";
    try {
      await this.serviceRepo.deleteService(id);
      runInAction(() => {
        const temp: MService[] = [];
        this.serviceList.forEach((item) => {
          item.id !== id && temp.push(item);
        });
        // assigning the new list to the store
        this.serviceList = temp;
        this.status = `Deleted service with id = ${id}`;
      });
    } catch (err: any) {
      runInAction(() => {
        this.status = err.message || "Failed to fetch services";
      });
    }
  };

  @action
  setDraftItem = (draft: MService | null) => {
    this.draftItem = draft;
  };

  @action
  setServiceCred = (sc: { id: string; secret: string } | null) => {
    this.serviceCred = sc;
  };

}
