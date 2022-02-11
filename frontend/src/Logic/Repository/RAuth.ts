import { MAuthCredentials } from "../Model/MAuth";
import { Request } from "../Util/Fetch";

export interface IRAuth {
  login: (service: MAuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export class RAuth implements IRAuth {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  async login(cred: MAuthCredentials) {
    try {
      const res = await Request.Post(`${this.baseUrl}/auth`, cred);
      const jsonData = await res.json();
      if (res.status !== 200) {
        throw new Error(jsonData.message);
      }
    } catch (err) {
      throw err;
    }
  }
  async logout() {
    try {
      const res = await Request.Delete(`${this.baseUrl}/auth`);
      if (res.status !== 200) {
        throw new Error((await res.json()).message);
      }
    } catch (err) {
      throw err;
    }
  }
}
