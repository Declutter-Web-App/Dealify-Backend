import Axios, { AxiosRequestConfig } from "axios";

export class RequestHandler {
  private static requestHandler: ReturnType<typeof Axios.create>
  static setup(config: AxiosRequestConfig) {
    this.requestHandler = Axios.create(config)
    return this.requestHandler
  }
}
