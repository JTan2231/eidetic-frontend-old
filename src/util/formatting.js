export const isIsoDate = (str) => {
    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{6}/.test(str);
}

export function formatTitle(title) {
    if (isIsoDate(title)) {
        return title.split('T')[1].split('.')[0];
    }

    return title;
}

export function formatTimestamp(timestamp) {
    return timestamp.split('T')[0];
}

function militaryToStandard(time) {
    time = time.split(':'); // convert to array

    let hours = Number(time[0]);
    let minutes = Number(time[1]);
    let seconds = Number(time[2]);

    let timeValue;

    if (hours > 0 && hours <= 12) {
      timeValue = "" + hours;
    }
    else if (hours > 12) {
      timeValue = "" + (hours - 12);
    }
    else if (hours === 0) {
      timeValue = "12";
    }
     
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;
    timeValue += (hours >= 12) ? " P.M." : " A.M.";

    return timeValue;
}

export function splitTimestamp(timestamp) {
    if (timestamp === '') {
        return timestamp;
    }

    timestamp = timestamp.split('Z')[0];
    let split = timestamp.split('T');
    split[1] = militaryToStandard(split[1].split('.')[0]);

    return `${split[0]}, ${split[1]}`;
}
