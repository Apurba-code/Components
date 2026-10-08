gsap.registerPlugin(ScrollTrigger);

const settings = {
    trigger: document.querySelector(".motion_showcase"),
    containers: document.querySelectorAll(".motion_block"),
    lerp: 0.05,
};

const motionManifesto = document.querySelectorAll(".motion_manifesto_line > h1");

const tlMain = gsap.timeline({
    scrollTrigger: {
        trigger: settings.trigger,
        start: "top top",
        end: "+=8000 bottom",
        scrub: 1,
        pin: true,
    },
});

const init = () => {
    initLenis();
    animateMedia();
};

const initLenis = () => {
    const lenis = new Lenis({
        lerp: settings.lerp,
        smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
};


const animateMedia = () => {
    gsap.set(motionManifesto, {
        yPercent: 100
    });
    settings.containers.forEach((element) => {
        const thumbnails = element.querySelectorAll(".motion_previews");
        const medias = element.querySelectorAll(".motion_stage");

        const heading = {
            title: element.querySelectorAll("h2"),
            roles: element.querySelectorAll(".motion_tags > span"),
        };

        gsap.set(thumbnails, {
            yPercent: 100
        });

        gsap.set(medias, {
            clipPath: "inset(0 0 0 0)"
        });

        gsap.set([heading.title, heading.roles], {
            yPercent: 0
        })

        tlMain
            .to(thumbnails, {
                duration: 2,
                yPercent: -100
            })

            .to(medias, {
                duration: 2,
                scale: 1.2
            }, "< -0.5")

            .to(medias, {
                clipPath: "inset(0 0 100% 0)",
            }, "> -0.2")

            .to([heading.title, heading.roles],
                {
                    yPercent: -100
                },
                "> -0.7"
            );
    });

    tlMain.to(motionManifesto, {
        yPercent: 0,
    });
}
window.addEventListener("DOMContentLoaded", init);