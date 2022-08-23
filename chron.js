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
    "KHA": {
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

if (isNaN(now)) {
    now = NORToLocal(1277 * 200 + 90 + 8 / 24, "PEN"); // 40th of Summer, 1277 8:00 PEN
}


function formatDate(dt) {
    let day = Math.floor(dt % 50) + 1;
    let season = ["Spring", "Summer", "Autumn", "Winter"][Math.floor(dt / 50) % 4];
    let year = Math.floor(dt / 200);
    
    return `${day}${[,'st','nd','rd'][day/10%10^1&&day%10]||'th'} of ${season}, ${year}`;
}
function formatDateShort(dt) {
    let day = Math.floor(dt % 50) + 1;
    let season = ["Spr", "Sum", "Aut", "Win"][Math.floor(dt / 50) % 4];

    return `${season} ${day}`;
}

function formatTime(dt) {
    let t = dt % 1;
    let hour = Math.floor(t * 24);
    if (hour == 0)
        hour = 24;
    let minute = Math.floor(((t * 24) % 1) * 60);
    
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
    console.log(now, dt)
    setNow(now + dt);
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

    console.log("ERROR: no arc found for heading " + theta);
    return null;
}

function nowNOR() {
    return now;
}

function nowLocal(arcName) {
    return NORToLocal(now, arcName);
}