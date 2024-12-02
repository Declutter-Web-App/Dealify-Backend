import Redis, { RedisOptions } from "ioredis"
import url from "url"
import config from "../core/config"

let redis_uri = url.parse(config.REDIS_URL!)

let redis: any

if (config.ENV === "HEROKU_PROD") {
  redis = new Redis({
    port: Number(redis_uri.port!) + 1,
    host: redis_uri.hostname!,
    password: redis_uri.auth!.split(":")[1]!,
    db: 0,
    tls: {
      rejectUnauthorized: false,
      requestCert: true,
      agent: false,
    } as RedisOptions,
  })
} else {
  redis = new Redis(config.REDIS_URL!)
}

redis.on("connect", function () {
  console.log("Connected to redis instance")
})

redis.on("error", function (e: any) {
  console.log("Error connecting to redis", e)
})

class RedisClient {
  static async setCache(payload: {
    key: string
    value: Record<any, any>
    expiry?: number
  }): Promise<string> {
    const { key, value, expiry = 60 * 30 } = payload
    return redis.set(key, JSON.stringify(value), "EX", expiry) //expires in 30 minutes
  }

  static async getCache(key: string): Promise<string | null> {
    return redis.get(key)
  }

  static async deleteCache(key: string): Promise<string | null> {
    return redis.del(key)
  }
}

export default RedisClient
