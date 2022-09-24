require("dotenv").config()

const express = require("express")
const note = express.Router()

const Note = require("../models/Note")
const User = require("../models/User")

note.delete("/notes/:id", async (req, res) => {
  const { id } = req.params
  try {
    const deletedNote = await Note.findByIdAndDelete(id)

    return res.status(200).send({
      status: "ok",
      notes: deletedNote,
      message: {
        title: "ลบบันทึกสำเร็จ",
        type: "ดำเนินการ",
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
})

note.put("/notes/:id", async (req, res) => {
  const { id } = req.params
  const { _id, content, isImg, type, whoBad, status, point } = req.body

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id },
      { _id, content, isImg, type, whoBad, status, point },
      { new: true }
    )
    return res.status(200).send({
      status: "ok",
      notes: note,
      message: {
        title: "อัปเดตข้อมูลสำเร็จ",
        type: "ดำเนินการ",
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
})

note.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find()

    return res.status(200).send({
      status: "ok",
      notes: notes,
      message: {
        title: "ดึงข้อมูลสำเร็จ",
        type: "ดำเนินการ",
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
})

note.post("/createnote", async (req, res) => {
  const { content, isImg, type, whoBad, status, point, by } = req.body
  try {
    const note = await Note.create({ content, isImg, type, whoBad, status, point, by })
    return res.status(201).send({
      status: "ok",
      note: note,
      message: {
        title: "สร้างบันทึกสำเร็จ",
        type: "ดำเนินการ",
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
})

module.exports = note
