/* =====================================================
   OWN GEZI — CINEMATIC LOADER ENGINE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const loader =
            document.getElementById(
                "ogLoader"
            );


        const progress =
            document.getElementById(
                "ogLoaderProgress"
            );


        const percentage =
            document.getElementById(
                "ogLoaderPercent"
            );


        if (!loader) return;


        /*
        -------------------------------------------------
        5 SECOND EXPERIENCE
        -------------------------------------------------
        */

        const duration = 5000;

        const startTime = performance.now();


        function updateLoader(
            currentTime
        ) {


            const elapsed =
                currentTime - startTime;


            let progressValue =
                elapsed / duration;


            if (progressValue > 1) {

                progressValue = 1;

            }


            const percent =
                Math.floor(
                    progressValue * 100
                );


            progress.style.width =
                percent + "%";


            percentage.textContent =
                String(percent)
                .padStart(2, "0") + "%";


            if (progressValue < 1) {

                requestAnimationFrame(
                    updateLoader
                );

            }

            else {

                finishLoader();

            }

        }


        requestAnimationFrame(
            updateLoader
        );


        /*
        -------------------------------------------------
        CINEMATIC EXIT
        -------------------------------------------------
        */

        function finishLoader() {


            loader.classList.add(
                "is-exiting"
            );


            /*
            Give the logo time to
            explode outward before
            removing the loader.
            */

            setTimeout(() => {


                loader.classList.add(
                    "is-hidden"
                );


                document.body.classList.add(
                    "og-site-ready"
                );


            }, 1200);

        }


    }
);


































/* =====================================================
   OWN GEZI — CENTRE MENU ENGINE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const menuButton =
            document.getElementById(
                "ogMenuButton"
            );


        const menuPanel =
            document.getElementById(
                "ogMenuPanel"
            );


        if (
            !menuButton ||
            !menuPanel
        ) {
            return;
        }


        /* =============================================
           OPEN / CLOSE MENU
        ============================================= */

        menuButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                const isOpen =
                    menuPanel.classList.contains(
                        "is-open"
                    );


                if (isOpen) {

                    closeMenu();

                } else {

                    openMenu();

                }

            }
        );


        /* =============================================
           OPEN
        ============================================= */

        function openMenu() {

            menuButton.classList.add(
                "is-open"
            );


            menuPanel.classList.add(
                "is-open"
            );


            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );


            menuButton.setAttribute(
                "aria-label",
                "Close menu"
            );

        }


        /* =============================================
           CLOSE
        ============================================= */

        function closeMenu() {

            menuButton.classList.remove(
                "is-open"
            );


            menuPanel.classList.remove(
                "is-open"
            );


            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );


            menuButton.setAttribute(
                "aria-label",
                "Open menu"
            );

        }


        /* =============================================
           CLICK OUTSIDE
        ============================================= */

        document.addEventListener(
            "click",
            (event) => {

                if (
                    !menuPanel.contains(
                        event.target
                    ) &&
                    !menuButton.contains(
                        event.target
                    )
                ) {

                    closeMenu();

                }

            }
        );


        /* =============================================
           MENU LINKS
        ============================================= */

        const menuLinks =
            menuPanel.querySelectorAll(
                ".og-menu-link"
            );


        menuLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMenu();

                    }
                );

            }
        );


        /* =============================================
           ESC KEY
        ============================================= */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape"
                ) {

                    closeMenu();

                }

            }
        );


    }
);








































// ==========================================
// OWN GEZI — ABOUT SECTION INTERACTIONS
// Scroll reveal + graceful fallback
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const aboutSection = document.querySelector(".og-about");

    if (!aboutSection) return;

    const revealItems = aboutSection.querySelectorAll(".og-about-reveal");

    // Show content immediately if animation is unsupported
    // or the visitor prefers reduced motion.
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => {
            item.classList.add("og-about-visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("og-about-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealItems.forEach((item) => observer.observe(item));

    // If the portrait cannot load, retain its designed background.
    const portrait = aboutSection.querySelector(".og-about-image");

    if (portrait) {
        portrait.addEventListener("error", () => {
            portrait.style.display = "none";
        });
    }
});
