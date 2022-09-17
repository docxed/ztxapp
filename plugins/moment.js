import Vue from "vue"
import moment from "moment"
import "moment/locale/th"

const $moment = moment
const $momentFormat = ({ date, format }) => {
  return date
    ? date.seconds
      ? moment.unix(date.seconds).format(format) // Timestamp Object
      : moment(date).format(format) // Date Type
    : "-" // No Data
}

Vue.prototype.$moment = $moment
Vue.prototype.$momentFormat = $momentFormat

export default ({}, inject) => {
  inject("moment", $moment)
  inject("momentFormat", $momentFormat)
}
