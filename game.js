const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
let fps = 120;
const camera = {
    // Note: Camera X and Y will always be negative due to movement inputs intentionally
    // moving in opposite directions (down arrow will reduce Y, moving cam up)
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    direction: new Set(),
    speed: 10
}
const world = {
    width: 2000,
    height: 1600,
    objects: [
        {x: 30, y: 30, width: 1700, height: 100, color: "yellow"}
    ]
}
// Used for keeping track of whenever the camera is and isn't touching a world border
const speedChanged = {
    top: true,
    left: true,
    bottom: true,
    right: true
}

// Start game once page's fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM content loaded");
    setInterval(() => {moveCam(), drawWorld()}, 1000/fps);
});

// Detect keypresses for WASD & Arrow keys
document.addEventListener("keydown", (event) => processDirections(event, "Down"));
document.addEventListener("keyup", (event) => processDirections(event, "Up"));

function processDirections(event, keyState) {
    const temp = event.key;
    const validInputs = ["w", "ArrowUp", "s", "ArrowDown", "a", "ArrowLeft", "d", "ArrowRight"];
    // Check for valid movement inputs
    if (validInputs.includes(temp)) {
        if (keyState === "Down") {
            camera.direction.add(temp);
        } else if (keyState === "Up") {
            camera.direction.delete(temp);
        }
    }
}

function moveCam() {
    let speedX = camera.speed;
    let speedY = camera.speed;

    // Counteract increased camera speed from diagonal movement
    if (camera.direction.size > 1) {
        speedX = speedY = Math.round((camera.speed - 3) / 10) * 10; // Speed rounded to the nearest tens place
    }
    
    // Prevent camera from moving past boundaries of world
    // I sincerely apologize for this hellspawn of code. Most of it is just used for logging whenever the camera hits a wall non-repetitively
    if (Math.abs(camera.x) <= 0 && (camera.direction.has("a") || camera.direction.has("ArrowLeft"))) {
        speedX = 0;
        if (speedChanged.left) {console.log("Left collision!"), speedChanged.left = false}
    } else if (Math.abs(camera.x) > 0) {speedChanged.left = true}
    if (Math.abs(camera.y) <= 0 && (camera.direction.has("w") || camera.direction.has("ArrowUp"))) {
        speedY = 0;
        if (speedChanged.top) {console.log("Top collision!"), speedChanged.top = false}
    } else if (Math.abs(camera.y) > 0) {speedChanged.top = true}
    if (Math.abs(camera.x) + camera.width >= world.width && (camera.direction.has("d") || camera.direction.has("ArrowRight"))) {
        speedX = 0;
        if (speedChanged.right) {console.log("Right collision!"), speedChanged.right = false}
    } else if (Math.abs(camera.x) + camera.width < world.width) {speedChanged.right = true}
    if (Math.abs(camera.y) + camera.height >= world.height && (camera.direction.has("s") || camera.direction.has("ArrowDown"))) {
        speedY = 0;
        if (speedChanged.bottom) {console.log("Bottom collision!"), speedChanged.bottom = false}
    } else if (Math.abs(camera.y) + camera.height < world.height) {speedChanged.bottom = true}

    // Move camera in opposite direction of button pressed
    if (camera.direction.has("w") || camera.direction.has("ArrowUp")) {camera.y += speedY}
    if (camera.direction.has("a") || camera.direction.has("ArrowLeft")) {camera.x += speedX}
    if (camera.direction.has("s") || camera.direction.has("ArrowDown")) {camera.y -= speedY}
    if (camera.direction.has("d") || camera.direction.has("ArrowRight")) {camera.x -= speedX}

    /* Camera coordinates test:
    console.log("Camera: " + camera.x + ", " + camera.y); */
}

function drawWorld() {
    // Background color
    ctx.fillStyle = "rgb(50,175,255)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for (let i=0; i<world.objects.length; i++) {
        const obj = world.objects[i];

        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x + camera.x, obj.y + camera.y, obj.width, obj.height);
    }
}