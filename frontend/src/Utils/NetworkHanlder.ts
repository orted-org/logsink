class HTTPHandler {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async Request(method: string, endpoint: string, data = {}) {
    const url = this.baseUrl + "/" + endpoint;
    const response = await fetch(url, {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export { HTTPHandler };
