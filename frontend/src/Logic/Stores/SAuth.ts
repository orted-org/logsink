import { observable, action, runInAction, makeAutoObservable } from "mobx";
import { MAuthCredentials } from "../Model/MAuth";
import { RAuth } from "../Repository/RAuth";

export class SAuth {
  @observable isLoggedIn: boolean = false;
  @observable status: string | null = null;
  constructor(private authRepo: RAuth) {
    makeAutoObservable(this);
  }

  @action
  login = async (cred: MAuthCredentials) => {
    this.status = "Logging in";
    try {
      await this.authRepo.login(cred);
      runInAction(() => {
        this.isLoggedIn = true;
        this.status = null;
      });
    } catch (err: any) {
      runInAction(() => {
        this.isLoggedIn = false;
        this.status = err.message || "Failed to log in";
      });
    }
  };

  @action
  logout = async () => {
    this.status = "Logging out";
    try {
      await this.authRepo.logout();
      runInAction(() => {
        this.isLoggedIn = false;
        this.status = null;
      });
    } catch (err: any) {
      runInAction(() => {
        this.status = err.message || "Failed to log in";
      });
    }
  };
}
