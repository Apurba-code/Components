const video = document.querySelector("#clip-video");
const masks = document.querySelectorAll(".mask-box");

// Mouse Follower
const follower = document.createElement("div");
follower.id = "mouse-follower";
document.body.appendChild(follower);

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;
let targetScale = 1;
let currentScale = 1;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function updateFollower() {
  followerX = lerp(followerX, mouseX, 0.15); // Smoothness factor
  followerY = lerp(followerY, mouseY, 0.15);
  currentScale = lerp(currentScale, targetScale, 0.15);

  follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%) scale(${currentScale})`;

  requestAnimationFrame(updateFollower);
}
updateFollower();

document.addEventListener("mouseleave", () => {
  targetScale = 0;
});

document.addEventListener("mouseenter", () => {
  targetScale = 1;
});

function drawClipped(ctx, video, rect) {
  // Calculate aspect ratios
  const videoAspect = video.videoWidth / video.videoHeight;
  const windowAspect = window.innerWidth / window.innerHeight;

  // Calculate how the video would be displayed to cover the entire window
  let displayWidth, displayHeight, displayX, displayY;

  if (videoAspect > windowAspect) {
    // Video is wider - fit to height, center horizontally
    displayHeight = window.innerHeight;
    displayWidth = displayHeight * videoAspect;
    displayX = (window.innerWidth - displayWidth) / 2;
    displayY = 0;
  } else {
    // Video is taller - fit to width, center vertically
    displayWidth = window.innerWidth;
    displayHeight = displayWidth / videoAspect;
    displayX = 0;
    displayY = (window.innerHeight - displayHeight) / 2;
  }

  // Calculate the scale factor between video dimensions and display dimensions
  const scaleX = video.videoWidth / displayWidth;
  const scaleY = video.videoHeight / displayHeight;

  // Calculate which portion of the video corresponds to the mask position
  const sourceX = (rect.left - displayX) * scaleX;
  const sourceY = (rect.top - displayY) * scaleY;
  const sourceWidth = rect.width * scaleX;
  const sourceHeight = rect.height * scaleY;

  // Draw the corresponding portion of the video to the canvas
  ctx.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    rect.width,
    rect.height
  );
}


function draw() {
  masks.forEach((mask) => {
    const canvas = mask.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const rect = mask.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    drawClipped(ctx, video, rect);
  });

  requestAnimationFrame(draw);
}

video.addEventListener("loadeddata", () => {
  video.play();
  draw();
});


masks.forEach(mask => {
  // Create tag element
  const tag = document.createElement("div");
  tag.className = "absolute -top-6 -left-1  text-white px-2 py-1 text-xs font-mono pointer-events-none font-bold";
  mask.appendChild(tag);

  // Function to update tag content
  const updateTag = () => {
    // Use targetX/Y if dragging, otherwise current rect
    const currentX = parseFloat(mask.style.left) || mask.getBoundingClientRect().left;
    const currentY = parseFloat(mask.style.top) || mask.getBoundingClientRect().top;
    tag.innerText = `X: ${Math.round(currentX)} Y: ${Math.round(currentY)}`;
  };

  // Initial update
  updateTag();

  // Mouse Follower Interaction
  mask.addEventListener("mouseenter", () => {
    follower.classList.add("expanded");
    follower.innerText = "Grab";
  });

  mask.addEventListener("mouseleave", () => {
    if (!isDragging) { // Only remove if not dragging
      follower.classList.remove("expanded");
      follower.innerText = "";
    }
  });

  let isDragging = false;
  let offsetX, offsetY;

  // Smooth Drag Variables
  let targetX = mask.offsetLeft;
  let targetY = mask.offsetTop;
  let currentX = mask.offsetLeft;
  let currentY = mask.offsetTop;
  let dragAnimationFrame;

  function animateDrag() {
    if (!isDragging && Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
      return; // Stop animating if settled
    }

    currentX = lerp(currentX, targetX, 0.1);
    currentY = lerp(currentY, targetY, 0.1);

    mask.style.left = `${currentX}px`;
    mask.style.top = `${currentY}px`;

    updateTag();

    if (isDragging || Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      dragAnimationFrame = requestAnimationFrame(animateDrag);
    }
  }

  mask.addEventListener("mousedown", e => {
    isDragging = true;

    // Calculate offset based on current precise position (or style) to avoid jumping
    // We strive to keep the mouse relative position constant
    const rect = mask.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Initialize targets to current position to prevent jumps
    targetX = rect.left;
    targetY = rect.top;
    currentX = rect.left;
    currentY = rect.top;

    follower.innerText = "Hold";

    // Start animation loop
    cancelAnimationFrame(dragAnimationFrame);
    animateDrag();
  });

  // Global mousemove for dragging
  document.addEventListener("mousemove", e => {
    if (isDragging) {
      targetX = e.clientX - offsetX;
      targetY = e.clientY - offsetY;
    }
  });

  document.addEventListener("mouseup", e => {
    if (isDragging) {
      isDragging = false;
      follower.innerText = "Grab"; // Revert to Grab (since we are likely still hovering)

      // Use a timeout to check if we are still hovering, if not remove class
      // Use document.elementFromPoint to check if mouse is over *this* mask
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!mask.contains(element)) {
        follower.classList.remove("expanded");
        follower.innerText = "";
      }
    }
  });
})