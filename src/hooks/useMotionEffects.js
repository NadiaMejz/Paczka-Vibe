import { useEffect } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useMotionEffects() {
    useEffect(() => {
        const root = document.documentElement;
        const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

        if (reducedMotion.matches) {
            resetMotionVars(root);
            return undefined;
        }

        let pointerFrame = null;
        let scrollFrame = null;

        function updateScrollVars() {
            scrollFrame = null;

            const scrollY = window.scrollY;
            root.style.setProperty("--scroll-lift-sm", `${-Math.min(scrollY * 0.025, 24)}px`);
            root.style.setProperty("--scroll-lift-xs", `${-Math.min(scrollY * 0.016, 16)}px`);
            root.style.setProperty("--scroll-lift-md", `${-Math.min(scrollY * 0.04, 42)}px`);
            root.style.setProperty("--scroll-lift-lg", `${-Math.min(scrollY * 0.055, 58)}px`);
            root.style.setProperty("--bg-offset-y", `${-scrollY * 0.16}px`);
        }

        function updatePointerVars(event) {
            if (pointerFrame) return;

            pointerFrame = window.requestAnimationFrame(() => {
                pointerFrame = null;

                const x = event.clientX / window.innerWidth - 0.5;
                const y = event.clientY / window.innerHeight - 0.5;

                root.style.setProperty("--pointer-x-soft", `${x * 8}px`);
                root.style.setProperty("--pointer-y-soft", `${y * 8}px`);
                root.style.setProperty("--pointer-x-bg", `${x * -18}px`);
                root.style.setProperty("--pointer-y-bg", `${y * -14}px`);
                root.style.setProperty("--pointer-tilt-x", `${y * -1.1}deg`);
                root.style.setProperty("--pointer-tilt-y", `${x * 1.1}deg`);
                root.style.setProperty("--hero-content-x", `${x * -2.8}px`);
                root.style.setProperty("--hero-content-y", `${y * -2}px`);
                root.style.setProperty("--hero-content-tilt-x", `${y * -0.38}deg`);
                root.style.setProperty("--hero-content-tilt-y", `${x * 0.38}deg`);
                root.style.setProperty("--hero-card-x", `${x * 4.4}px`);
                root.style.setProperty("--hero-card-y", `${y * 2.8}px`);
                root.style.setProperty("--hero-card-tilt-x", `${y * -0.6}deg`);
                root.style.setProperty("--hero-card-tilt-y", `${x * 0.6}deg`);
                root.style.setProperty("--result-x", `${x * -1.4}px`);
                root.style.setProperty("--result-y", `${y * -1.4}px`);
                root.style.setProperty("--mood-hover-x", `${x * 1}px`);
                root.style.setProperty("--mood-hover-y", `${y * 0.7}px`);
            });
        }

        function requestScrollUpdate() {
            if (!scrollFrame) {
                scrollFrame = window.requestAnimationFrame(updateScrollVars);
            }
        }

        updateScrollVars();
        window.addEventListener("scroll", requestScrollUpdate, { passive: true });
        window.addEventListener("pointermove", updatePointerVars, { passive: true });

        return () => {
            window.removeEventListener("scroll", requestScrollUpdate);
            window.removeEventListener("pointermove", updatePointerVars);
            if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
            if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
            resetMotionVars(root);
        };
    }, []);
}

function resetMotionVars(root) {
    root.style.setProperty("--scroll-lift-sm", "0px");
    root.style.setProperty("--scroll-lift-xs", "0px");
    root.style.setProperty("--scroll-lift-md", "0px");
    root.style.setProperty("--scroll-lift-lg", "0px");
    root.style.setProperty("--bg-offset-y", "0px");
    root.style.setProperty("--pointer-x-soft", "0px");
    root.style.setProperty("--pointer-y-soft", "0px");
    root.style.setProperty("--pointer-x-bg", "0px");
    root.style.setProperty("--pointer-y-bg", "0px");
    root.style.setProperty("--pointer-tilt-x", "0deg");
    root.style.setProperty("--pointer-tilt-y", "0deg");
    root.style.setProperty("--hero-content-x", "0px");
    root.style.setProperty("--hero-content-y", "0px");
    root.style.setProperty("--hero-content-tilt-x", "0deg");
    root.style.setProperty("--hero-content-tilt-y", "0deg");
    root.style.setProperty("--hero-card-x", "0px");
    root.style.setProperty("--hero-card-y", "0px");
    root.style.setProperty("--hero-card-tilt-x", "0deg");
    root.style.setProperty("--hero-card-tilt-y", "0deg");
    root.style.setProperty("--result-x", "0px");
    root.style.setProperty("--result-y", "0px");
    root.style.setProperty("--mood-hover-x", "0px");
    root.style.setProperty("--mood-hover-y", "0px");
}
