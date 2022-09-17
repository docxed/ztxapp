require("dotenv").config()
const { JWT_SECRET } = process.env

const express = require("express")
const user = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")
const { requireAuthToken, requireRoles } = require("./middleware")

user.post("/signin", async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).send({ message: "ไม่พบอีเมลนี้ในระบบ" })
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) return res.status(400).send({ message: "รหัสผ่านไม่ถูกต้อง" })
    const token = jwt.sign(
      { email: user.email, id: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    )
    return res.status(200).send({
      status: "ok",
      token: token,
      authData: {
        email: user.email,
        id: user._id,
        name: user.name,
        role: user.role,
      },
      message: {
        title: "เข้าสู่ระบบสำเร็จ",
        type: "ดำเนินการ",
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
})

user.post("/signup", async (req, res) => {
  const { email, name, password } = req.body
  const isEmailExist = await User.findOne({ email })
  if (isEmailExist) return res.status(400).send({ message: "อีเมลซ้ำในระบบ" })
  const passwordEncrypted = await bcrypt.hash(password, 10)
  try {
    const user = await User.create({ email, name, password: passwordEncrypted })
    console.log(`ลงทะเบียนอีเมล ${user.email} สำเร็จ`)
    return res.status(201).send({
      status: "ok",
      user: user,
      message: {
        title: "สมัครสมาชิกสำเร็จ",
        type: "ดำเนินการ",
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
})

user.get("/users", async (req, res) => {
  return res.send({
    status: "ok",
    users: await User.find(),
    message: {
      title: "โหลดข้อมูลผู้ใช้งานทั้งหมดสำเร็จ",
      type: "ดำเนินการ",
    },
  })
})

module.exports = user
