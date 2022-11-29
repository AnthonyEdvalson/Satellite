const tau = Math.PI * 2;

//var loc = JSON.parse(localStorage.getItem("loc"));
if (window.location.hostname == "") {
    loc = JSON.parse(localStorage.getItem("loc"));
}

let pxr = window.devicePixelRatio;
var showUI = true;

function loadImage(url) {
    let img = new Image();
    img.src = url;
    img.decode().then(() => console.log(url))
    return img;
}

const mapImg = loadImage("map.jpeg");

const icons = {
    "label": null,
    "part": loadImage("icons/Part.png"),
    "landmark": loadImage("icons/Landmark.png"),
    "settlement": loadImage("icons/Settlement.png"),
    "city": loadImage("icons/City.png"),
    "caves": loadImage("icons/Caves.png"),
    "ruins": loadImage("icons/Ruins.png"),
    "quest": loadImage("icons/Quest.png"),
    "npc": loadImage("icons/NPC.png"),
    "merchant": loadImage("icons/Merchant.png"),
    "enemy": loadImage("icons/Enemy.png"),
    "orb": loadImage("icons/Orb.png"),
    "gold": loadImage("icons/Gold.png"),
    "artifact": loadImage("icons/Artifact.png"),
    "weapon": loadImage("icons/Weapon.png"),
    "lost": loadImage("icons/Lost.png")
}


const colors = {
    "label": null,
    "part": "#BA3C3C",
    "landmark": "#516EA4",
    "settlement": "#516EA4",
    "city": "#516EA4",
    "caves": "#404754",
    "ruins": "#404754", 
    "quest": "#BF9627",
    "npc": "#91471F",
    "merchant": "#91471F",
    "enemy": "#BA3C3C",
    "orb": "#7434B0",
    "gold": "#D69C1D",
    "artifact": "#7434B0",
    "weapon": "#603F29",
    "lost": "#7434B0"
}


let mouseX = 0;
let mouseY = 0;
let hovered = null;
let focused = null;

let mapX = 0.5; // map space x position at the screen center
let mapY = 0.5; // map space y position at the screen center
let mapScale = 0.5; // map is width of screen when mapScale is 1

let zoom = Math.log2(mapScale);

let ruler0 = null;
let ruler1 = null;
let rulerMode = 0;
let rulerModes = [
    {
        name: "",
        miles_per_hour: 3,
        miles_per_day: 24,
    },
    {
        name: "sail",
        miles_per_hour: 2,
        miles_per_day: 48
    },
    {
        name: "fast",
        miles_per_hour: 4,
        miles_per_day: 30,
    },
    {
        name: "slow",
        miles_per_hour: 2,
        miles_per_day: 18
    },
    {
        name: "difficult",
        miles_per_hour: 1.5,
        miles_per_day: 12
    },
    {
        name: "miles",
        miles_per_hour: 1,
        miles_per_day: 1
    }
]
let mapWidthMiles = 1024;

// COORDINATE SPACES
// Pixel Space    1 unit = 1 viewport pixel, origin at top left corner of viewport
// Screen Space   1 unit = 1 viewport width, origin at top left corner
// Map Space      1 unit = 1 map width, origin at top left corner
// Image Space    1 unit = 1 map pixel, origin at top left corner

function pixelToScreen(x, y) {
    return {
        x: x / window.innerWidth,
        y: y / window.innerWidth
    }
}

function screenToMap(x, y) {
    let cy = window.innerHeight / window.innerWidth * 0.5;
    return {
        x: (x - 0.5) / mapScale + mapX,
        y: (y - cy) / mapScale + mapY
    }
}

function mapToImage(x, y) {
    return {
        x: x * mapImg.width,
        y: y * mapImg.height
    }
}

function imageToMap(x, y) {
    return {
        x: x / mapImg.width,
        y: y / mapImg.height
    }
}

function mapToScreen(x, y) {
    let cy = window.innerHeight / window.innerWidth * 0.5;
    return {
        x: (x - mapX) * mapScale + 0.5,
        y: (y - mapY) * mapScale + cy
    }
}

function screenToPixel(x, y) {
    return {
        x: Math.round(x * window.innerWidth),
        y: Math.round(y * window.innerWidth)
    }
}

function pixelToMap(x, y) {
    let p = pixelToScreen(x, y);
    return screenToMap(p.x, p.y);
}

function mapToPixel(x, y) {
    let p = mapToScreen(x, y);
    return screenToPixel(p.x, p.y);
}

window.onload = function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params.l !== undefined) {
        let l = loc.pins[params.l];
        if (l !== undefined) {
            mapX = l.x;
            mapY = l.y;
            zoom = 3;
            mapScale = 8;
            focused = params.l;
            showUI = false;
            updateTimeline(null, null);
        }
    }

    drawAll();
}

// move controls

document.getElementById("anno").addEventListener('wheel', (e) => {
    e.preventDefault();
    let zx = e.clientX;
    let zy = e.clientY;
    let zm = pixelToMap(zx, zy);

    zoom -= e.deltaY / 1000;
    let zmax = Math.log2(mapImg.width / window.innerWidth * 4);
    zoom = Math.max(Math.min(zoom, zmax), -1);
    mapScale = Math.pow(2, zoom);

    let zm2 = pixelToMap(zx, zy);

    let dx = zm.x - zm2.x;
    let dy = zm.y - zm2.y;

    mapX += dx;
    mapY += dy;

    drawAll();
});

document.getElementById("anno").addEventListener('mousemove', (e) => {
    e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (e.metaKey) {
        if (ruler0 == null) {
            ruler0 = pixelToMap(mouseX, mouseY);
        }
        ruler1 = pixelToMap(mouseX, mouseY);

        drawAnno();
        return;
    }
    
    if (e.buttons == 1) {
        let dm = pixelToMap(e.movementX, e.movementY);
        let zm = pixelToMap(0, 0);
        let dx = dm.x - zm.x;
        let dy = dm.y - zm.y;

        if (e.shiftKey && focused !== null) {
            loc.pins[focused].x += dx;
            loc.pins[focused].y += dy;
            setDirty(true);
        }
        else {
            mapX -= dx;
            mapY -= dy;
            mapX = Math.max(Math.min(mapX, 1.5), -0.5);
            mapY = Math.max(Math.min(mapY, 1.5), -0.5);
            drawAll();
        }
    }
    drawAnno();
});

addEventListener('resize', () => {
    drawAll();
});

document.getElementById("anno").addEventListener('dblclick', (e) => {

    let id = loc["maxIndex"] + 1;

    loc.pins[id] = {
        name: 'New Location',
        x: pixelToMap(e.clientX, e.clientY).x,
        y: pixelToMap(e.clientX, e.clientY - 1).y,
        page: "",
        category: 'landmark',
        layer: 'public'
    };

    loc["maxIndex"] = id;
    focused = id;
    setDirty(true);

    drawAnno();
    drawEditor();

    document.getElementById("edit-name").focus();
    document.getElementById("edit-name").select();
});

var temp = []
document.getElementById("anno").addEventListener('click', (e) => {
    focusOn(hovered);
} );

document.addEventListener('keydown', (e) => {
    if (focused !== null && e.metaKey) {
        if (e.key == 'Backspace') {
            delete loc.pins[focused];
            focused = null;
            setDirty(true);
            drawAnno();
        }
        if (e.key == 'ArrowDown') {
            let sel = document.getElementById("edit-category");
            sel.options[(sel.selectedIndex + 1) % sel.options.length].selected = true;
            editorInvalidate();
        }
        if (e.key == 'ArrowUp') {
            let sel = document.getElementById("edit-category");
            sel.options[(sel.selectedIndex - 1 + sel.options.length) % sel.options.length].selected = true;
            editorInvalidate();
        }
        if (e.key == 'l') {
            let sel = document.getElementById("edit-layer");
            sel.options[(sel.selectedIndex + 1) % sel.options.length].selected = true;
            editorInvalidate();
        }
    }

    if (e.key = 'Meta' && !e.ctrlKey) {
        ruler0 = null;
        ruler1 = null;
        drawAnno();
    }

    if (e.metaKey && e.key == 'Control') {
        rulerMode = (rulerMode + 1) % rulerModes.length;
        drawAnno();
    }

    if (e.key == "t") {
        let p = pixelToMap(mouseX, mouseY);
        temp.push(p);
        console.log(JSON.stringify(temp));
    }
    if (e.key == "r") {
        temp = [];
    }
} );

function drawAll() {
    const canvas = document.getElementById("map");
    canvas.width = window.innerWidth * pxr;
    canvas.height = window.innerHeight * pxr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(pxr, pxr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();

    let p0 = mapToPixel(0, 0);
    let p1 = mapToPixel(1, 1);
    ctx.drawImage(mapImg, p0.x, p0.y, p1.x - p0.x, p1.y - p0.y, );

    drawAnno();
    drawEditor();
}

function drawAnno() {
    const canvas = document.getElementById("anno");
    canvas.width = window.innerWidth * pxr;
    canvas.height = window.innerHeight * pxr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(pxr, pxr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let mouseMap = pixelToMap(mouseX, mouseY);
    let tz = getArcFromPoint(mouseMap.x, mouseMap.y);
    let wz = getZoneFromPoint(mouseMap.x, mouseMap.y);

    if (showUI) {
        document.getElementById("time").innerHTML = formatDateTime(nowLocal(tz)) + " " + tz;

        let lightTime = nowNOR();
        let lighting = getAllLighting(lightTime);
        let dawnspire = loc.pins[0];
        let p0 = mapToPixel(dawnspire.x, dawnspire.y);
        for (let l of Object.values(lighting)) {
            let t0 = -tau / 4 + l.t0 / 360 * tau;
            let t1 = -tau / 4 + l.t1 / 360 * tau;

            let color = {
                "day": "transparent",
                "night": "black",
                "dawn": "orange",
                "dusk": "orange",
            }[l.light] 

            ctx.globalAlpha = 0.1;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p0.x + Math.cos(t0) * 100000, p0.y + Math.sin(t0) * 100000);
            ctx.lineTo(p0.x + Math.cos(t1) * 100000, p0.y + Math.sin(t1) * 100000);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.globalAlpha = 0.4;

            ctx.beginPath();
            ctx.moveTo(p0.x + Math.cos(t1) * 100000, p0.y + Math.sin(t1) * 100000);
            ctx.lineTo(p0.x, p0.y);
            ctx.lineTo(p0.x + Math.cos(t0) * 100000, p0.y + Math.sin(t0) * 100000);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        for (let [name, zone] of Object.entries(weatherZones)) {
            ctx.beginPath();

            let prev = mapToPixel(zone.bounds[zone.bounds.length-1].x, zone.bounds[zone.bounds.length-1].y)
            ctx.moveTo(prev.x, prev.y);
            for (let point of zone.bounds) {
                let next = mapToPixel(point.x, point.y)
                ctx.lineTo(next.x, next.y);
                prev = next;
            }
            ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    let pins = Object.entries(loc.pins);
    // sort by y
    pins.sort((a, b) => (a[0] === focused ? 10000000 : a[1].y) - (b[0] === focused ? 10000000 : b[1].y));

    hovered = null;
    for (let [id, l] of pins) {
        let p = mapToPixel(l.x, l.y);
        
        ctx.globalAlpha = 1;// l.layer == 'public' ? 1 : 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 11.6, p.y - 21.1);
        ctx.arc(p.x, p.y - 27, 13, Math.PI - 0.47, 0.47);
        ctx.lineTo(p.x, p.y);
        ctx.fillStyle = colors[l.category];
        ctx.fill();
        ctx.strokeStyle = focused == id ? "white" : "black";
        ctx.lineWidth = focused == id ? 2 : 0.5;
        ctx.stroke();
        ctx.drawImage(icons[l.category], p.x - 11, p.y - 37, 22, 22);
        ctx.globalAlpha = 1;

        let hovering = mouseX > p.x - 13 && mouseX < p.x + 13 && mouseY > p.y - 40 && mouseY < p.y;

        if (hovering) {
            hovered = id;
        }
    }

    let callout = document.getElementById("callout");
    let calloutId = focused === null ? hovered : focused;
    if (calloutId) {
        let l = loc.pins[calloutId];
        let p = mapToPixel(l.x, l.y);

        callout.style.display = "block";
        callout.style.left = `${p.x}px`;
        callout.style.top = `${p.y}px`;
        document.getElementById("callout-head").innerHTML = "<h1>" + l.name + "</h1>";
        document.getElementById("callout-head").href = l.page;
        document.getElementById("callout-link").onclick = () => navigator.clipboard.writeText("https://anthonyedvalson.github.io/Satellite/?l=" + focused);
    }
    else {
        callout.style.display = "none";
    }

    if (ruler0 && ruler1) {
        let p0 = mapToPixel(ruler0.x, ruler0.y);
        let p1 = mapToPixel(ruler1.x, ruler1.y);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();

        let d_miles = Math.sqrt(Math.pow(ruler0.x - ruler1.x, 2) + Math.pow(ruler0.y - ruler1.y, 2)) * mapWidthMiles;
        let m = rulerModes[rulerMode];
        let t_days = estimateTime(d_miles, m.miles_per_hour, m.miles_per_day);

        let s = formatDays(t_days);
        let name = m.name;
        if (name)
            s = "(" + name + ") " + s;

        let srcTz = getArcFromPoint(ruler0.x, ruler0.y);
        let dstTz = getArcFromPoint(ruler1.x, ruler1.y);
        let arrivalDate = formatDateTimeShort(nowLocal(dstTz) + t_days);
        if (srcTz != dstTz) {
            arrivalDate += ` (${dstTz})`;
        }

        ctx.font = "12px sans-serif";
        ctx.textAlign = "right";
        let width = Math.max(ctx.measureText(s).width, ctx.measureText(arrivalDate).width);
        ctx.rect(p1.x - width - 9, p1.y - 12, width + 6, 27);
        ctx.fillStyle = "#404040";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText(s, p1.x - 6, p1.y);
        ctx.fillText(arrivalDate, p1.x - 6, p1.y + 12);

        let t0 = mapToPixel(0, 0);
        let t1 = mapToPixel(1, 0);
        let px_per_mile = (t1.x - t0.x) / mapWidthMiles;
        theta = Math.atan2(ruler1.y - ruler0.y, ruler1.x - ruler0.x);
        let px_per_day = m.miles_per_day * px_per_mile;
        
        // Draw distance circles centered at ruler0
        for (let d = 1; d < t_days + 1; d++) {
            let r = px_per_day * d;
            ctx.beginPath();
            ctx.arc(p0.x, p0.y, r, theta - Math.PI / (d + 4), theta + Math.PI / (d + 4));
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);


            ctx.textAlign = "right";
            let t_x = Math.round(p0.x + (r + 3) * Math.cos(theta));
            let t_y = Math.round(p0.y + (r + 3) * Math.sin(theta));
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.strokeText(d, t_x - 3, t_y - 8);
            ctx.fillStyle = "black";
            ctx.fillText(d, t_x - 3, t_y - 8);
        };
    }
    
    //let s = mouseMap.x.toFixed(3) + ", " + mouseMap.y.toFixed(3)
    //ctx.strokeStyle = "black";
    //ctx.lineWidth = 1;
    //ctx.font = "16px sans-serif";
    //ctx.strokeText(s, 5, 45)
    //ctx.fillStyle = "white";
    //ctx.fillText(s, 5, 45);

    updateTimeline(tz, wz)
}

let timelineCache = null;
function updateTimeline(tz, wz) {
    if (!showUI) {
        document.getElementById("bottomBar").style.display = "none";
        document.getElementById("edit").style.display = "none";
        document.getElementById("topBar").style.display = "none";
        return;
    }
    let start = nowLocal(tz);
    if (timelineCache && tz == timelineCache.tz && wz == timelineCache.wz && start == timelineCache.start) {
        return;
    }
    timelineCache = {tz, wz, start};

    // Rows:
    // Weather, an item is added every 4 hours. Hovering gives details, and color is the condition
    // Travel, while the ruler is used, this row is added and It shows when travel / rest is happening.
    
    let timeline = document.getElementById("timeline-time");
    let timeline2 = document.getElementById("timeline-time2");
    let weatherconline = document.getElementById("timeline-weather-condition");
    let weathertempline = document.getElementById("timeline-weather-temp");
    let weatherwindline = document.getElementById("timeline-weather-wind");
    let weathercloudline = document.getElementById("timeline-weather-clouds");
    let travelline = document.getElementById("timeline-travel");
    let timelabel = document.getElementById("timelabel-time");
    let timelabel2 = document.getElementById("timelabel-time2");
    let weatherconlabel = document.getElementById("timelabel-weather-condition");
    let weathertemplabel = document.getElementById("timelabel-weather-temp");
    let weatherwindlabel = document.getElementById("timelabel-weather-wind");
    let weathercloudlabel = document.getElementById("timelabel-weather-clouds");
    let travellabel = document.getElementById("timelabel-travel");
    for (let l of [timeline, timeline2, weatherconline, weathertempline, weatherwindline, weathercloudline, travelline]) {
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
    }
    
    let hourWidth = 15;
    let dayWidth = 24 * hourWidth;

    let days = 200;

    let dt2px = (dt) => (dt - start) * dayWidth;

    let prevL = {};
    let createItem = (m, l, start, end, text, color) => {
        let prev = prevL[m];
        if (prev && Math.abs(prev.end - start) < 0.0001 && prev.text == text && prev.color == color && Math.floor(prev.start) == Math.floor(start)) {
            prev.end = end;
            return;
        }
        else if (prev) {
            let item = document.createElement("div");
            item.style.width = dt2px(prev.end) - dt2px(prev.start) + "px";
            item.style.left = dt2px(prev.start) + "px";
            item.style.backgroundColor = prev.color;
            item.innerText = prev.text;
            item.classList.add("timeitem");
            l.appendChild(item);
        }

        prevL[m] = {start, end, text, color};
    }

    timelabel.innerText = tz;
    for (let i = 0; i < days * 24; i++) {
        let hourStart = Math.floor(start * 24 + i) / 24 + 0.0001;
        let dayOfYear = getDayOfYear(hourStart) + 1;
        let dayStart = Math.floor(hourStart);
        //let isDayPreStart = Math.abs(Math.round(hourStart) - hourStart - 1/24) < 0.001;
        //let isDayStart = Math.abs(Math.round(hourStart) - hourStart) < 0.001;

        let lighting = getLighting(hourStart + 0.25 / 24, tz);
        let color = {"night": "#112244", "day": "#3366CC", "dawn": "#224488", "dusk": "#224488"}[lighting];

        let hour = getHour(hourStart);
        let t = hour;
        if (hour == 2) {
            t = getDayOfSeason(hourStart) + 1;
        }
        if (hour == 1) {
            t = ["HR", "HA", "HO", "EY"][getSeason(hourStart)];
        }

        createItem(
            0,
            timeline,
            hourStart, 
            hourStart + 1/24, 
            t, 
            hour <= 2 ? "#081122" : color);

        if (hour == 1 && dayOfYear in holidays[tz]) {
            createItem(
                7,
                timeline2,
                dayStart,
                dayStart + 1,
                holidays[tz][dayOfYear],
                "#BB7733"
            )
        }
    }
    createItem(7, timeline2, start + days, start + days, "", "transparent");

    let forecast = getForecast(wz, tz, start, days);

    weatherconlabel.innerText = wz;
    for (let event of forecast) {
        let start = event.time;
        let end = event.time + 2/24;
        if (event.condition !== "CALM") {
        createItem(
            1,
            weatherconline,
            start,
            end,
            event.condition,
            event.color);
        }
        let t = event.windChill;
        let tempColor = "#013";
        if (t >= -60) tempColor = "#126";
        if (t >= -20) tempColor = "#47A";
        if (t >=   0) tempColor = "#7AB";
        if (t >=  32) tempColor = "#8B8";
        if (t >=  90) tempColor = "#BA7";
        if (t >= 110) tempColor = "#A74";
        if (t >= 130) tempColor = "#621";
        if (t >= 150) tempColor = "#310";
        createItem(
            2,
            weathertempline,
            start,
            end,
            t,
            tempColor);
        let w = event.wind;
        let windColor = "#BBB";
        if (w > 0) windColor = "#AAA";
        if (w >= 10) windColor = "#999";
        if (w >= 20) windColor = "#777";
        if (w >= 30) windColor = "#555";
        if (w >= 45) windColor = "#333";
        if (w >= 75) windColor = "#111";
        createItem(
            3,
            weatherwindline,
            start,
            end,
            Math.round(event.wind) + " mph",
            windColor);
        let c = event.clouds;
        let cloudColor = "#59D";
        if (c >= 0.2) cloudColor = "#79C";
        if (c >= 0.4) cloudColor = "#89B";
        if (c >= 0.8) cloudColor = "#567";
        if (c >= 1.0) cloudColor = "#345";
        createItem(
            4,
            weathercloudline,
            start,
            end,
            Math.round(100 * event.clouds) + "%",
            cloudColor);
    }
    // TODO alt TZ, same as time, but for a different timezone
    travellabel.innerText = rulerModes[rulerMode].name;
    if (ruler0 && ruler1) {
        let d_miles = Math.sqrt(Math.pow(ruler0.x - ruler1.x, 2) + Math.pow(ruler0.y - ruler1.y, 2)) * mapWidthMiles;
        let m = rulerModes[rulerMode];
        let t_days = estimateTime(d_miles, m.miles_per_hour, m.miles_per_day);

        for (let d = 0; d < t_days; d++) {
            let hoursPerDay = m.miles_per_day / m.miles_per_hour;

            createItem(
                5,
                travelline,
                start + d,
                start + Math.min(t_days, d + hoursPerDay / 24),
                "Travel " + (d + 1),
                "#BB7733");

            if (d < t_days - 1) {
                createItem(
                    6,
                    travelline,
                    start + d + hoursPerDay / 24,
                    start + d + 1,
                    "Rest " + (d + 1),
                    "#3377BB"
                );
            }
        }
    }
}

function estimateTime(miles, miles_per_hour, miles_per_day) {
    days = 0;
    let miles_left = miles;
    while (miles_left > 0) {
        if (miles_left > miles_per_day) {
            days++;
            miles_left -= miles_per_day;
        }
        else {
            days += miles_left / miles_per_hour / 24;
            miles_left = 0;
        }
    }
    return days;
}

function formatDays(t) {
    t = Math.abs(t);

    let d = t;
    let h = (t % 1) * 24;
    let m = (t % (1 / 24)) * 24 * 60;
    
    if (t > 1)
        return `${Math.floor(d)}d ${Math.round(h)}h`;
    else if (h > 1)
        return `${Math.floor(h)}h ${Math.round(m)}m`;
    else
        return `${Math.round(m)}m`;
}

//function save() {
    //navigator.clipboard.writeText("loc = " + JSON.stringify(loc, null, 4))
//}

function focusOn(target) {
    focused = target;
    ruler0 = null;
    ruler1 = null;
    drawEditor();
    drawAnno();
}

function drawEditor() {
    if (focused == null || !showUI) {
        document.getElementById("edit").style.display = "none";
        return;
    }
    let l = loc.pins[focused];
    document.getElementById("edit").style.display = "block";
    document.getElementById("edit-head").innerHTML = focused + ": " + l.name;
    document.getElementById("edit-name").value = l.name;
    document.getElementById("edit-page").value = l.page;
    document.getElementById("edit-category").value = l.category;
    document.getElementById("edit-layer").value = l.layer;
}

function editorInvalidate() {
    let l = loc.pins[focused];
    l.name = document.getElementById("edit-name").value;
    l.page = document.getElementById("edit-page").value;
    l.category = document.getElementById("edit-category").value;
    l.layer = document.getElementById("edit-layer").value;
    setDirty(true);
    drawAnno();
    drawEditor();
}

function save() {
    localStorage.setItem("loc", JSON.stringify(loc));
    setDirty(false);
}

function setDirty(dirty) {
    if (dirty) {
        document.getElementById("save").style.display = "inline";
        window.onbeforeunload = function (e) {
            return "You have unsaved changes.";
        }
    }
    else {
        document.getElementById("save").style.display = "none";
        window.onbeforeunload = null;
    }
}

document.addEventListener("nowChanged", function (e) {
    drawAnno();
} );

function getArcFromPoint(x, y) {
    let d = loc.pins[0];
    let theta = Math.atan2(y - d.y, x - d.x) / tau * 360 + 90;
    return getArcFromHeading(theta);
}