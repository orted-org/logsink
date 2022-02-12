import MService from "../Model/MService";
import { Request } from "../Util/Fetch";

export interface IRService {
  createService: (service: MService) => Promise<void>;
  getServiceList: () => Promise<MService[]>;
  updateService: (service: MService) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export class RService implements IRService {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  async createService(service: MService) {
    try {
      const res = await Request.Post(`${this.baseUrl}/service`);
      if (res.status !== 201) {
        throw new Error("something went wrong");
      }
    } catch (err) {
      throw err;
    }
  }
  async getServiceList() {
    let serviceList: MService[] = [];
    try {
      const res = await Request.Get(`${this.baseUrl}/service`);
      const jsonData = await res.json();
      if (res.status !== 200) {
        throw new Error(jsonData.message);
      }
      serviceList = jsonData.data.map((item: any): MService => {
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          createdAt: new Date(item.created_at),
        };
      });
    } catch (err) {
      throw err;
    }
    return serviceList;
  }
  async updateService(service: MService) {
    const jsonData = {
      name: service.name,
      description: service.description,
    };
    try {
      const res = await Request.Put(
        `${this.baseUrl}/service/${service.id}`,
        jsonData
      );
      if (res.status !== 200) {
        throw new Error("something went wrong");
      }
    } catch (err) {
      throw err;
    }
  }
  async deleteService(id: string) {
    try {
      const res = await Request.Delete(`${this.baseUrl}/service/${id}`);
      if (res.status !== 200) {
        throw new Error("something went wrong");
      }
    } catch (err) {
      throw err;
    }
  }
}
