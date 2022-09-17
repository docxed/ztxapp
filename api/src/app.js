require("dotenv").config()

const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

// Setup Middleware
const app = express()
app.use(express.json())
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.PROD_URL : process.env.DEV_URL,
    credentials: true,
  })
)
app.use(cookieParser())
require("../config/db-connect")

// Register controllers
const user = require("./controller/userController")
const notify = require("./controller/notifyController")

app.get("/", (req, res) => {
  res.status(200).send("Hello This is 🚀 ZTX App API!")
})
app.use("/api", user)
app.use("/api", notify)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`🚀 Server is runnung on port`, port)
})

// 404 Error
app.use((req, res, next) => {
  const error = new Error("Not Found")
  error.status = 404
  next(error)
})

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.json({
    error: {
      message: err.message,
    },
  })
})
