export class Request {
  static async Raw(
    url: string,
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    data = {}
  ) {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method === "GET" ? null : JSON.stringify(data),
    });
    return response;
  }

  // just some sugar coated functions to make working easy
  static async Get(url: string, data = {}) {
    return this.Raw(url, "GET", data);
  }
  static async Post(url: string, data = {}) {
    return this.Raw(url, "POST", data);
  }
  static async Delete(url: string, data = {}) {
    return this.Raw(url, "DELETE", data);
  }
  static async Patch(url: string, data = {}) {
    return this.Raw(url, "PATCH", data);
  }
  static async Put(url: string, data = {}) {
    return this.Raw(url, "PUT", data);
  }
}
