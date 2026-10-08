 // Initialize Locomotive Scroll
    const scroll = new LocomotiveScroll({
      el: document.querySelector("#main"),
      smooth: true
    });

    scroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("#main", {
      scrollTop(value) {
        return arguments.length
          ? scroll.scrollTo(value, { duration: 0, disableLerp: true })
          : scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => scroll.update());
    ScrollTrigger.refresh();

    // GSAP animation for cards
    document.querySelectorAll(".card").forEach(card => {
      gsap.to(card, {
        scale: 0.7,
        opacity: 0,
        filter: "blur(20px)",
        scrollTrigger: {
          trigger: card,
          start: "top 15%",
          end: "bottom 15%",
          scrub: true,
          scroller: "#main"
        }
      });
    });