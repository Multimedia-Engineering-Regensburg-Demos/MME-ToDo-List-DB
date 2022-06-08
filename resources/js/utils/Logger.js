/* eslint-disable no-magic-numbers, no-console */

let enabled = false;

function getFormattedTime(date) {
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
        time = getFormattedTime(new Date());
        console.log(`${time}\t${msg}`);
    }

}

export default Logger;