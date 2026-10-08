const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
});

const framesCount = 50;
const images = [];
const frameInfo = {
    index: 1
};

let imagesLoaded = 0;
function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === framesCount) {
        requestAnimationFrame(raf);
    }
}

// Initial image loading and rendering
function init() {
    for (let i = 1; i <= framesCount; i++) {
        const img = new Image();
        // Zero padding for filenames (01, 02, ..., 50)
        img.src = `./frames/${i.toString().padStart(2, '0')}.png`;
        img.onload = checkImagesLoaded;
        images.push(img);
    }
}

// Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    render();
    requestAnimationFrame(raf);
}

function render() {
    const currentFrame = images[Math.floor(frameInfo.index) - 1];
    if (!currentFrame || !currentFrame.complete) return;

    const scale = Math.max(canvas.width / currentFrame.width, canvas.height / currentFrame.height);
    const x = (canvas.width / 2) - (currentFrame.width / 2) * scale;
    const y = (canvas.height / 2) - (currentFrame.height / 2) * scale;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(currentFrame, 0, 0, currentFrame.width, currentFrame.height, x, y, currentFrame.width * scale, currentFrame.height * scale);
}

lenis.on('scroll', (e) => {
    // Map scroll progress (0-1) to frame index (1-50)
    frameInfo.index = 1 + (e.progress * (framesCount - 1));
});

init();
