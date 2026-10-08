// Initialize Locomotive Scroll on the scroll container
const locoScroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true
});

function marquee() {
  let currentScroll = 0;
  let lastTimestamp = Date.now();
  let arrows = document.querySelectorAll(".arrow");

  let tween = gsap.to(".marquee__part", {
    xPercent: -100,
    repeat: -1,
    duration: 5,
    ease: "linear"
  }).totalProgress(0.5);

  gsap.set(".marquee__inner", {
    xPercent: -50
  });

  locoScroll.on("scroll", function(obj) {
    let newScroll = obj.scroll.y;
    let now = Date.now();
    let deltaScroll = Math.abs(newScroll - currentScroll);
    let deltaTime = now - lastTimestamp;
    let velocity = deltaTime > 0 ? deltaScroll / deltaTime : 0;

    // Base speed is 1, add velocity for fast scrolls
    let speed = 1 + velocity * 10;
    let isScrollingDown = newScroll > currentScroll;

    gsap.to(tween, {
      timeScale: isScrollingDown ? speed : -speed,
      overwrite: true
    });

    arrows.forEach((arrow) => {
      if (isScrollingDown) {
        arrow.classList.remove("active");
      } else {
        arrow.classList.add("active");
      }
    });

    currentScroll = newScroll;
    lastTimestamp = now;
  });
}
marquee();

