const moment = require("moment-timezone")
moment.tz.setDefault("Asia/Bangkok")
moment.locale("th")

module.exports = moment
