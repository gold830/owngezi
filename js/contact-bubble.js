/* =========================================
   BLOVEN DECOR — DRAG, SNAP & CONTACT MENU
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const bubble = document.getElementById("contactBubble");
    const button = document.getElementById("contactBubbleButton");
    const options = document.getElementById("contactBubbleOptions");

    if (!bubble || !button || !options) return;

    let dragging = false;
    let moved = false;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let originalLeft = 0;
    let originalTop = 0;

    const DRAG_THRESHOLD = 5;
    const EDGE_GAP = 8;

    const clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);

    function getBounds() {
        const rect = bubble.getBoundingClientRect();

        return {
            width: rect.width,
            height: rect.height,
            maxLeft: Math.max(0, window.innerWidth - rect.width),
            maxTop: Math.max(0, window.innerHeight - rect.height)
        };
    }

    function setPosition(left, top) {
        const b = getBounds();

        bubble.style.left = `${clamp(left, 0, b.maxLeft)}px`;
        bubble.style.top = `${clamp(top, 0, b.maxTop)}px`;
        bubble.style.right = "auto";
        bubble.style.bottom = "auto";
    }

    function snapToEdge() {
        const rect = bubble.getBoundingClientRect();
        const b = getBounds();

        const snapLeft =
            rect.left + rect.width / 2 <= window.innerWidth / 2;

        const left = snapLeft
            ? EDGE_GAP
            : Math.max(EDGE_GAP, b.maxLeft - EDGE_GAP);

        const top = clamp(rect.top, 8, b.maxTop - 8);

        bubble.classList.remove("is-dragging");
        bubble.classList.toggle("dock-left", snapLeft);
        bubble.classList.toggle("dock-right", !snapLeft);

        setPosition(left, top);
    }

    function openMenu() {
        bubble.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        button.setAttribute("aria-label", "Close contact options");
    }

    function closeMenu() {
        bubble.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open contact options");
    }

    function toggleMenu() {
        if (bubble.classList.contains("is-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function onPointerDown(event) {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if (dragging) return;

        const rect = bubble.getBoundingClientRect();

        dragging = true;
        moved = false;
        pointerId = event.pointerId;

        startX = event.clientX;
        startY = event.clientY;
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        originalLeft = rect.left;
        originalTop = rect.top;

        try {
            bubble.setPointerCapture(event.pointerId);
        } catch (_) {
            // Continue without pointer capture when unavailable.
        }
    }

    function onPointerMove(event) {
        if (!dragging || event.pointerId !== pointerId) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        if (!moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

        if (!moved) {
            moved = true;
            closeMenu();
            bubble.classList.add("is-dragging");

            document.body.style.userSelect = "none";
            document.body.style.webkitUserSelect = "none";

            setPosition(originalLeft, originalTop);
        }

        setPosition(
            event.clientX - offsetX,
            event.clientY - offsetY
        );
    }

    function finishPointer(event) {
        if (!dragging || event.pointerId !== pointerId) return;

        const wasDragged = moved;

        dragging = false;
        pointerId = null;
        moved = false;

        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";

        if (wasDragged) {
            snapToEdge();
        } else {
            toggleMenu();
        }
    }

    bubble.addEventListener("pointerdown", onPointerDown);
    bubble.addEventListener("pointermove", onPointerMove);
    bubble.addEventListener("pointerup", finishPointer);
    bubble.addEventListener("pointercancel", finishPointer);

    bubble.addEventListener("lostpointercapture", () => {
        if (!dragging) return;

        const wasDragged = moved;

        dragging = false;
        pointerId = null;
        moved = false;

        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";

        if (wasDragged) snapToEdge();
    });

    // Clicking an external area closes the contact menu.
    document.addEventListener("pointerdown", event => {
        if (!bubble.contains(event.target)) {
            closeMenu();
        }
    });

    // Keyboard accessibility.
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });

    // Reposition the widget after device rotation or resizing.
    window.addEventListener("resize", () => {
        if (dragging) return;

        const rect = bubble.getBoundingClientRect();
        const b = getBounds();

        setPosition(
            clamp(rect.left, 8, Math.max(8, b.maxLeft - 8)),
            clamp(rect.top, 8, Math.max(8, b.maxTop - 8))
        );

        snapToEdge();
    });

    // Keep the initial position within the viewport.
    requestAnimationFrame(() => {
        const rect = bubble.getBoundingClientRect();
        setPosition(rect.left, rect.top);
        snapToEdge();
    });
});