const mongoose = require("mongoose")
const { Schema } = mongoose

const noteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    isImg: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    whoBad: {
      type: String,
      default: "",
    },
    point: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: false,
    },
    by: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  {
    collection: "notes",
  }
)

module.exports = mongoose.model("Note", noteSchema)
