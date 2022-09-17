require("dotenv").config()
const { LINE_NOTIFY_HOST, LINE_NOTIFY_TOKEN } = process.env

const axios = require("axios")
const express = require("express")
const notify = express.Router()

notify.post("/notify", async (req, res) => {
  const { message, stickerPackageId, stickerId } = req.body
  axios({
    method: "post",
    url: `https://${LINE_NOTIFY_HOST}/api/notify`,
    headers: {
      Authorization: `Bearer ${LINE_NOTIFY_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
    },
    data: `message=${message}&stickerPackageId=${stickerPackageId}&stickerId=${stickerId}`,
  })
    .then((response) => {
      return res.status(200).send({
        status: "ok",
        message: {
          title: "ส่งการแจ้งเตือนสำเร็จ",
          type: "ดำเนินการ",
        },
      })
    })
    .catch((error) => {
      console.error(error)
      return res.status(500).send(error)
    })
})

module.exports = notify
