import ratelimit from '../config/upstash.js'

const rateLimiter = async (req, res, next) => {
  try {
    // limit by userId, ip address: need to fix this
    const {success} = await ratelimit.limit("my-rate-limit")

    if (!success) {
      return res.status(429).json({
        message: "Too man requests, please try again later"
      })
    } 
    next()

  } catch (error) {
    console.log("Rate limit error", error)
    next(error)
  }
}

export default rateLimiter