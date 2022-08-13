let pxr = window.devicePixelRatio;

function loadImage(url) {
    let img = new Image();
    img.src = url;
    return img;
}

const mapImg = loadImage("map.png");

const icons = {
    "label": null,
    "part": loadImage("icons/Landmark.png"),
    "landmark": loadImage("icons/Landmark.png"),
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

let mapX = 0.66; // map space x position at the screen center
let mapY = 0.43; // map space y position at the screen center
let mapScale = 4; // map is width of screen when mapScale is 1

let zoom = 2;

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

    if (params.l) {
        let l = loc.pins[params.l];
        if (l) {
            mapX = l.x;
            mapY = l.y;
            zoom = 0;
            focused = params.l;
        }
    }

    if (params.e) {
        document.getElementById("edit-mode").style.display = "block";
    }

    drawAll();
}

// move controls

document.getElementById("anno").addEventListener('wheel', (e) => {
    let zx = e.clientX;
    let zy = e.clientY;
    let zm = pixelToMap(zx, zy);

    zoom -= e.deltaY / 1000;
    let zmax = Math.log2(mapImg.width / window.innerWidth * 2);
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
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (e.buttons == 1) {
        let dm = pixelToMap(e.movementX, e.movementY);
        let zm = pixelToMap(0, 0);
        let dx = dm.x - zm.x;
        let dy = dm.y - zm.y;

        if (e.shiftKey && focused !== null) {
            loc.pins[focused].x += dx;
            loc.pins[focused].y += dy;
            drawAnno();
        }
        else {
            mapX -= dx;
            mapY -= dy;

            mapX = Math.max(Math.min(mapX, 1.5), -0.5);
            mapY = Math.max(Math.min(mapY, 1.5), -0.5);

            drawAll();
        }
    }
    else {
        drawAnno();
    }
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

    drawAnno();
    drawEditor();

    document.getElementById("edit-name").focus();
    document.getElementById("edit-name").select();
});

document.getElementById("anno").addEventListener('click', (e) => {
    focusOn(hovered);
} );

document.addEventListener('keydown', (e) => {
    if (focused !== null && e.metaKey) {
        if (e.key == 'Backspace') {
            delete loc.pins[focused];
            focused = null;
            drawAnno();
        }
        if (e.key == 'ArrowRight') {
            let sel = document.getElementById("edit-category");
            sel.options[(sel.selectedIndex + 1) % sel.options.length].selected = true;
            editorInvalidate();
        }
        if (e.key == 'ArrowLeft') {
            let sel = document.getElementById("edit-category");
            sel.options[(sel.selectedIndex - 1) % sel.options.length].selected = true;
            editorInvalidate();
        }
        if (e.key == 'l') {
            let sel = document.getElementById("edit-layer");
            sel.options[(sel.selectedIndex + 1) % sel.options.length].selected = true;
            editorInvalidate();
        }
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
    ctx.drawImage(mapImg, p0.x, p0.y, p1.x - p0.x, p1.y - p0.y);
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

    hovered = null;
    for (let [id, l] of Object.entries(loc.pins)) {
        let p = mapToPixel(l.x, l.y);
        
        ctx.globalAlpha = l.layer == 'public' ? 1 : 0.6;
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
        document.getElementById("callout-link").href = window.location.href.split('?')[0] + "?l=" + focused;
    }
    else {
        callout.style.display = "none";
    }
}

function save() {
    navigator.clipboard.writeText("loc = " + JSON.stringify(loc, null, 4))
}

function focusOn(target) {
    focused = target;
    drawEditor();
    drawAnno();
}

function drawEditor() {
    if (focused == null) {
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
    drawAnno();
    drawEditor();
}