const jwt = require("jsonwebtoken")
require("dotenv").config()
const { JWT_SECRET } = process.env

const moment = require("./moment")

/**
 * @param {string[]} roles ex. ['admin'], ['admin', 'user']
 */
const requireRoles = (roles) => async (req, res, next) => {
  const auth = req.headers?.authorization
  if (!auth) {
    return res.status(401).send({ status: "UNAUTHORIZED REQUEST!" })
  }
  const [bearer, token] = auth.split(" ")
  if (bearer !== "Bearer") {
    return res.status(401).send({ status: "UNAUTHORIZED REQUEST!" })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    if (roles.includes(decoded.role)) {
      req.user = decoded
      return next()
    }

    console.error("Permission | เข้าใช้งานได้เฉพาะ", roles.toString(), "เท่านั้น")
    return res.status(403).send({ status: "FORBIDDEN", role: roles.join(", ") })
  } catch (error) {
    console.error("Token | หมดอายุการเข้าใช้งาน ->", error)
    return res.status(401).send({ status: "UNAUTHORIZED REQUEST!" })
  }
}

const validate = (datakey, schema) => async (req, res, next) => {
  const data = req[datakey]
  const validator = Joi.object(schema)

  try {
    const value = await validator.validateAsync(data)
    req.data = value
    next()
  } catch (error) {
    const messages = {}

    for (const item of error.details) {
      messages[item.context.key] = {
        message: item.message,
        value: item.context.value,
        type: item.type,
      }
    }

    return res.status(400).send(messages)
  }
}

// Create Date With Moment Timezone
/**
 * @returns {object} type date
 */
const momentCreateDate = ({
  date,
  addDay = 0,
  subtractDay = 0,
  startOfDay = false,
  endOfDay = false,
}) => {
  const now = date ? moment(date) : moment()
  if (startOfDay) now.startOf("day")
  if (endOfDay) now.endOf("day")
  if (addDay) now.add(addDay, "days")
  if (subtractDay) now.subtract(subtractDay, "days")
  return now.toDate()
}

// Get Date With Moment Timezone
/**
 * @returns {object} type date
 */
const momentGetDate = (date) => {
  return date
    ? date.seconds
      ? moment.unix(date.seconds).toDate()
      : moment(date).toDate()
    : moment().toDate()
}

// Get String Format of Date With Moment Timezone
/**
 * @returns {string} string format of date
 */
const momentFormatStr = ({ date, format }) => {
  return date
    ? date.seconds
      ? moment.unix(date.seconds).format(format) // Timestamp Object
      : moment(date).format(format) // Date Type
    : moment().format(format) // Now
}

const requireAuthToken = async (req, res, next) => {
  const auth = req.headers?.authorization
  if (!auth) {
    return res.status(401).send({ status: "UNAUTHORIZED REQUEST!" })
  }

  const [bearer, token] = auth.split(" ")
  if (bearer !== "Bearer") {
    return res.status(401).send({ status: "UNAUTHORIZED REQUEST!" })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.error(error)
    return res.status(401).send({ status: "UNAUTHORIZED REQUEST!" })
  }
}

exports.requireRoles = requireRoles
exports.validate = validate
exports.momentCreateDate = momentCreateDate
exports.momentGetDate = momentGetDate
exports.momentFormatStr = momentFormatStr
exports.requireAuthToken = requireAuthToken
