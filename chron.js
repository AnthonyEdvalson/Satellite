var now = parseFloat(localStorage.getItem('now'));

const nowChanged = new Event('nowChanged');

//
// "CODE": {
//     t0: start angle,
//     t1: end angle,
//     off: hours you need to add to north time to get local time
//     EITHER:
//     lock: "day" or "night"
//     OR:
//     break: local time of daybreak
//     rise: local time of sunrise
//     set: local time of sunset
//     fall: local time of nightfall
// }
const arcs = {
    "VAT": {
        t0: 20,
        t1: 60,
        off: 22,

        break: 9,
        rise: 12,
        set: 14,
        fall: 17
    },
    "SHA": {
        t0: 60,
        t1: 140,
        off: 22,

        break: 5,
        rise: 6,
        set: 20,
        fall: 23
    },
    "PEN": {
        t0: 140,
        t1: 195,
        off: 12,

        break: 6,
        rise: 7,
        set: 19,
        fall: 20
    },
    "STA": {
        t0: 195,
        t1: 235,
        off: 10,
        lock: "day"
    },
    "KAL": {
        t0: 235,
        t1: 260,
        off: 11,

        break: 6,
        rise: 8,
        set: 21,
        fall: 22
    },
    "MAR": {
        t0: 260,
        t1: 278,
        off: 4,

        break: 5,
        rise: 5.5,
        set: 22.5,
        fall: 23
    },
    "LAP": {
        t0: 278,
        t1: 20,
        off: 2,
        lock: "night"
    }
}

const holidays = {
    "VAT": {
        51: "First of Summer",
    },
    "SHA": {
    },
    "PEN": {
        7: "Queen Birthday",
        97: "Peace Day",
        163: "Rememberance Eve",
    },
    "STA": {
        108: "Thakii",
        109: "Thakii",
        110: "Thakii",
        111: "Thakii",
        112: "Thakii",
        113: "Thakii",
        114: "Thakii",
        115: "Thakii",
        116: "Thakii",
    },
    "KAL": {
        3: "Death of ???",
        71: "Wellspring Day",
        91: "Dragon Day",
        148: "Elders Day",
        156: "Founding Day",
        175: "Visiret"
    },
    "MAR": {
    },
    "LAP": {
        75: "Summer Solstice",
        175: "Winter Solstice"
    },

    "ALL": {
        1: "Day of Dawn",
        164: "Rememberance Day",
    }
}
// Add everything in ALL to the other time zones.
for (let tz of Object.keys(holidays)) {
    if (tz !== "ALL") {
        for (let day of Object.keys(holidays["ALL"])) {
            holidays[tz][day] = holidays["ALL"][day];
        }
    }
}

if (isNaN(now)) {
    now = NORToLocal(1677 * 200 + 90 + 8 / 24, "PEN"); // 40th of Summer, 1677 8:00 PEN
}


function formatDate(dt) {
    let day = getDayOfSeason(dt) + 1;
    let season = ["Spring", "Summer", "Autumn", "Winter"][getSeason(dt)];
    let year = getYear(dt);
    return `${day}${[,'st','nd','rd'][day/10%10^1&&day%10]||'th'} of ${season}, ${year}`;
}
function formatDateShort(dt) {
    let day = getDayOfSeason(dt) + 1;
    let season = ["Spr", "Sum", "Aut", "Win"][getSeason(dt)];
    return `${season} ${day}`;
}

function formatTime(dt) {
    let hour = getHour(dt);
    let minute = getMinute(dt);
    return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
}

function formatDateTime(dt) {
    return formatDate(dt) + " " + formatTime(dt);
}

function formatDateTimeShort(dt) {
    return formatDateShort(dt) + " " + formatTime(dt);
}

function getLighting(dt, arcName) {
    let t = dt % 1;
    let hour = t * 24;
    let arc = arcs[arcName];

    if ("lock" in arc) {
        return arc.lock;
    }

    if (getDayOfYear(dt) + 1 == 1) {
        return "day"; // Day of Dawn
    }
    if (getDayOfYear(dt) + 1 == 164) {
        return "night"; // Rememberance Day
    }

    if (hour < arc.break) {
        return "night";
    }
    if (hour < arc.rise) {
        return "dawn";
    }
    if (hour < arc.set) {
        return "day";
    }
    if (hour < arc.fall) {
        return "dusk";
    }
    return "night";
}

function getAllLighting(ndt) {
    let lighting = {};
    for (let arcName of Object.keys(arcs)) {
        let dt = NORToLocal(ndt, arcName);
        lighting[arcName] = {
            light: getLighting(dt, arcName),
            t0: arcs[arcName].t0,
            t1: arcs[arcName].t1
        };
    }
    return lighting;
}

function localToNOR(dt, arcName) {
    if (arcName == "NOR")
        return dt;
    let arc = arcs[arcName];
    return dt - arc.off / 24;
}

function NORToLocal(ndt, arcName) {
    if (arcName == "NOR")
        return ndt;
    let arc = arcs[arcName];
    return ndt + arc.off / 24;
}

function setNow(ndt) {
    now = ndt;
    localStorage.setItem('now', now);
    document.dispatchEvent(nowChanged);
}

function addNow(dt) {
    setNow(now + dt);
}

function getYear(dt) {
    return Math.floor(dt / 200);
}

function getSeason(dt) {
    return Math.floor((dt / 50) % 4);
}

function getDayOfSeason(dt) {
    return Math.floor(dt % 50);
}

function getDayOfYear(dt) {
    return Math.floor(dt % 200);
}

function getHour(dt) {
    let h = Math.floor((dt % 1) * 24)
    if (h == 0)
        return 24;
    return h;
}

function getMinute(dt) {
    return Math.floor((((dt % 1) * 24) % 1) * 60);
}

function getArcFromHeading(theta) {
    theta = (theta + 3600000) % 360;
    for (let arc of Object.keys(arcs)) {
        let t0 = arcs[arc].t0;
        let t1 = arcs[arc].t1;

        if (theta >= t0 && theta < t1) {
            return arc;
        }
        if (t0 > t1 && (theta >= t0 || theta < t1)) {
            return arc;
        }
    }

    console.error("ERROR: no arc found for heading " + theta);
    return null;
}

function nowNOR() {
    return now;
}

function nowLocal(arcName) {
    return NORToLocal(now, arcName);
}

