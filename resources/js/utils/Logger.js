/* eslint-env browser*/

var enabled = false;

function getFormatedTime(date) {
  let hours, minutes;
  hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
  minutes = (date.getMinutes() < 10 ? "0" : "") + date.getHours();
  return `${hours}:${minutes}`;
}

class Logger {

  static enable() {
    enabled = true;
  }

  static disable() {
    enabled = false;
  }

  static log(msg) {
    let time;
    if (enabled === false) {
      return;
    }
    time = getFormatedTime(new Date());
    console.log(`${time}\t${msg}`);
  }

}

export default Logger;