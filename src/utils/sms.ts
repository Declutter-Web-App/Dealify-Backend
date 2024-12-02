import axios, { AxiosResponse } from "axios"
import config from "../core/config"

const { TERMII_BASE_URL, TERMII_KEY } = config

export const sendSms = async (
  to: string,
  text: string,
  type = null,
  sender: string = "ExpressCity"
) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: "POST",
      url: `${TERMII_BASE_URL}/api/sms/send`,
      params: {
        api_key: TERMII_KEY,
        sms: text,
        from: sender,
        to,
        type: "plain",
        channel: "generic",
      },
    }
    axios(options)
      .then((response: AxiosResponse) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
