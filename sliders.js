(function () {
    'use strict';

    // ---- CONFIG ----
    const CAROUSEL_SELECTOR = '#carousel-container .e-n-carousel.swiper';
    const THROTTLE_MS = 200;
    const HINT_DELAY = 3000; // auto-hide hint after 3s

    // ---- STATE ----
    let swiperInstance = null;
    let isHovered = false;
    let isVisible = false;
    let lastWheelTime = 0;
    let hintTimeout = null;

    // ---- DOM REFS ----
    const carouselWrapper = document.querySelector(CAROUSEL_SELECTOR);
    if (!carouselWrapper) {
        console.warn('Carousel not found.');
        return;
    }

    const widgetContainer = carouselWrapper.closest('.elementor-widget-n-carousel');
    if (!widgetContainer) return;

    // ---- CREATE HINT ELEMENT ----
    function createHint() {
        const hint = document.createElement('div');
        hint.className = 'carousel-scroll-hint';
        hint.innerHTML = `
            <span class="hint-icon">🖱️</span>
            <span class="hint-text">Scroll to navigate</span>
        `;
        // Hide initially
        hint.style.display = 'none';
        widgetContainer.style.position = 'relative'; // ensure positioning
        widgetContainer.appendChild(hint);
        return hint;
    }

    const hint = createHint();

    // ---- INJECT CSS ----
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Scroll hint */
            .carousel-scroll-hint {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.7);
                color: #fff;
                padding: 8px 16px;
                border-radius: 30px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.4s ease, transform 0.4s ease;
                z-index: 99;
                font-family: sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                white-space: nowrap;
            }
            .carousel-scroll-hint.visible {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            .carousel-scroll-hint .hint-icon {
                font-size: 18px;
                animation: hintPulse 1.5s infinite;
            }
            @keyframes hintPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            /* Slide scale effect */
            .e-n-carousel .swiper-slide {
                transition: transform 0.4s ease, opacity 0.4s ease;
                transform: scale(0.92);
                opacity: 0.8;
            }
            .e-n-carousel .swiper-slide-active {
                transform: scale(1);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    injectStyles();

    // ---- GET SWIPER ----
    function getSwiper() {
        if (carouselWrapper.swiper) return carouselWrapper.swiper;
        if (carouselWrapper.__swiper) return carouselWrapper.__swiper;
        return null;
    }

    // ---- VIEWPORT OBSERVER ----
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            updateHintVisibility();
        });
    }, { threshold: 0.3 });
    observer.observe(carouselWrapper);

    // ---- HOVER ----
    widgetContainer.addEventListener('mouseenter', () => {
        isHovered = true;
        updateHintVisibility();
    });
    widgetContainer.addEventListener('mouseleave', () => {
        isHovered = false;
        updateHintVisibility();
        // hide hint after a short delay
        clearTimeout(hintTimeout);
        hintTimeout = setTimeout(() => {
            hint.classList.remove('visible');
        }, 300);
    });

    // ---- HINT VISIBILITY ----
    function updateHintVisibility() {
        if (isHovered || isVisible) {
            hint.style.display = 'flex';
            // Show with a slight delay to avoid flicker
            clearTimeout(hintTimeout);
            setTimeout(() => {
                hint.classList.add('visible');
            }, 200);
            // Auto-hide after HINT_DELAY
            clearTimeout(hintTimeout);
            hintTimeout = setTimeout(() => {
                hint.classList.remove('visible');
            }, HINT_DELAY);
        } else {
            hint.classList.remove('visible');
        }
    }

    // ---- WHEEL EVENT ----
    function onWheel(e) {
        if (!swiperInstance) {
            swiperInstance = getSwiper();
            if (!swiperInstance) return;
        }

        if (!isHovered && !isVisible) return;

        const deltaY = e.deltaY;
        const goingDown = deltaY > 0;
        const goingUp = deltaY < 0;

        if (goingDown && swiperInstance.isEnd) return;
        if (goingUp && swiperInstance.isBeginning) return;

        e.preventDefault();

        const now = Date.now();
        if (now - lastWheelTime < THROTTLE_MS) return;
        lastWheelTime = now;

        if (goingDown) {
            swiperInstance.slideNext();
        } else if (goingUp) {
            swiperInstance.slidePrev();
        }
    }

    widgetContainer.addEventListener('wheel', onWheel, { passive: false });

    // ---- (Optional) Update scale on slide change ----
    // The CSS transition already handles it, but we can also trigger a reflow if needed.

    console.log('Enhanced carousel scroll-control with animations enabled.');
})();

// slider on


(function () {
    'use strict';

    // ---- CONFIGURATION ----
    const CAROUSEL_SELECTOR = '#carousel-container .e-n-carousel.swiper';
    const THROTTLE_MS = 200; // minimum time between slide changes

    // ---- STATE ----
    let swiperInstance = null;
    let isHovered = false;
    let isVisible = false;
    let lastWheelTime = 0;

    // ---- DOM REFS ----
    const carouselWrapper = document.querySelector(CAROUSEL_SELECTOR);
    if (!carouselWrapper) {
        console.warn('Carousel not found. Selector:', CAROUSEL_SELECTOR);
        return;
    }

    // Get the parent container that holds the widget (to attach mouse events)
    const widgetContainer = carouselWrapper.closest('.elementor-widget-n-carousel');
    if (!widgetContainer) {
        console.warn('Widget container not found.');
        return;
    }

    // ---- GET SWIPER INSTANCE ----
    function getSwiper() {
        // Swiper instance is attached to the .swiper element after initialization
        if (carouselWrapper.swiper) {
            return carouselWrapper.swiper;
        }
        // Fallback: try __swiper (older versions)
        if (carouselWrapper.__swiper) {
            return carouselWrapper.__swiper;
        }
        return null;
    }

    // ---- VIEWPORT OBSERVER ----
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, {
        threshold: 0.3 // at least 30% visible to consider "in viewport"
    });
    observer.observe(carouselWrapper);

    // ---- MOUSE HOVER ----
    widgetContainer.addEventListener('mouseenter', () => {
        isHovered = true;
    });
    widgetContainer.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    // ---- WHEEL EVENT HANDLER ----
    function onWheel(e) {
        // Only handle if we have a swiper instance
        if (!swiperInstance) {
            swiperInstance = getSwiper();
            if (!swiperInstance) return;
        }

        // Check if carousel is active (hovered OR visible)
        if (!isHovered && !isVisible) {
            return; // do not intercept
        }

        const deltaY = e.deltaY;
        // Determine direction: down (positive) => next, up (negative) => prev
        const goingDown = deltaY > 0;
        const goingUp = deltaY < 0;

        // Check boundaries
        if (goingDown && swiperInstance.isEnd) {
            // At last slide, allow page scroll down
            return;
        }
        if (goingUp && swiperInstance.isBeginning) {
            // At first slide, allow page scroll up
            return;
        }

        // Prevent default page scroll
        e.preventDefault();

        // Throttle to avoid too many slides
        const now = Date.now();
        if (now - lastWheelTime < THROTTLE_MS) {
            return;
        }
        lastWheelTime = now;

        // Navigate
        if (goingDown) {
            swiperInstance.slideNext();
        } else if (goingUp) {
            swiperInstance.slidePrev();
        }
    }

    // ---- ATTACH EVENT ----
    // Listen on the widget container (or document) – we use the container to limit scope
    widgetContainer.addEventListener('wheel', onWheel, { passive: false });

    // ---- CLEANUP (optional) ----
    // If you need to remove listeners later, you can expose a cleanup function.
    // For simplicity, we don't.

    console.log('Carousel scroll-control enabled.');
})();



/// Screp 3


(function () {
    'use strict';

    //  CONFIG
    const CAROUSEL_SELECTOR = '#carousel-container .e-n-carousel.swiper';
    const THROTTLE_MS = 250;
    const SLIDE_SPEED = 800;   // smooth transition (ms)
    const SHOW_HINT = true;
    const HINT_DELAY = 3000;

    //  FIND CAROUSEL
    const carouselWrapper = document.querySelector(CAROUSEL_SELECTOR);
    if (!carouselWrapper) {
        console.warn('❌ Carousel not found. Selector:', CAROUSEL_SELECTOR);
        return;
    }
    console.log('✅ Carousel found.');

    const widgetContainer = carouselWrapper.closest('.elementor-widget-n-carousel');
    if (!widgetContainer) {
        console.warn('❌ Widget container not found.');
        return;
    }

    //  GET SWIPER INSTANCE (with retry)
    let swiperInstance = null;

    function getSwiper() {
        if (carouselWrapper.swiper) return carouselWrapper.swiper;
        if (carouselWrapper.__swiper) return carouselWrapper.__swiper;
        return null;
    }

    // Poll until Swiper is ready
    function waitForSwiper() {
        const swiper = getSwiper();
        if (swiper) {
            swiperInstance = swiper;
            console.log('✅ Swiper instance attached.');
            init();
        } else {
            console.log('⏳ Waiting for Swiper...');
            setTimeout(waitForSwiper, 100);
        }
    }
    waitForSwiper();

    //  STATE
    let isHovered = false;
    let isVisible = false;
    let lastWheelTime = 0;
    let hintEl = null;
    let hintTimeout = null;

    //  HINT (optional)
    function createHint() {
        if (!SHOW_HINT) return;
        const hint = document.createElement('div');
        hint.className = 'carousel-scroll-hint';
        hint.innerHTML = '<span>🖱️ Scroll to navigate</span>';
        Object.assign(hint.style, {
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '14px',
            pointerEvents: 'none',
            opacity: '0',
            transition: 'opacity 0.3s',
            zIndex: '99',
            fontFamily: 'sans-serif',
            whiteSpace: 'nowrap',
        });
        widgetContainer.style.position = 'relative';
        widgetContainer.appendChild(hint);
        hintEl = hint;
    }

    function updateHint() {
        if (!hintEl) return;
        const show = isHovered || isVisible;
        clearTimeout(hintTimeout);
        if (show) {
            hintEl.style.display = 'block';
            void hintEl.offsetWidth; // force reflow
            hintEl.style.opacity = '1';
            hintTimeout = setTimeout(() => {
                hintEl.style.opacity = '0';
            }, HINT_DELAY);
        } else {
            hintEl.style.opacity = '0';
        }
    }

    //  VIEWPORT OBSERVER
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            updateHint();
        });
    }, { threshold: 0.3 });
    observer.observe(carouselWrapper);

    //  MOUSE EVENTS
    widgetContainer.addEventListener('mouseenter', () => {
        isHovered = true;
        updateHint();
    });
    widgetContainer.addEventListener('mouseleave', () => {
        isHovered = false;
        updateHint();
    });

    //  WHEEL HANDLER
    function onWheel(e) {
        if (!swiperInstance) return;

        // Only intercept if hovered or visible
        if (!isHovered && !isVisible) return;

        const deltaY = e.deltaY;
        const goingDown = deltaY > 0;
        const goingUp = deltaY < 0;

        // Allow page scroll at boundaries
        if (goingDown && swiperInstance.isEnd) return;
        if (goingUp && swiperInstance.isBeginning) return;

        e.preventDefault();

        // Throttle
        const now = performance.now();
        if (now - lastWheelTime < THROTTLE_MS) return;
        lastWheelTime = now;

        // Move one slide
        const currentIndex = swiperInstance.activeIndex;
        let targetIndex = goingDown ? currentIndex + 1 : currentIndex - 1;
        const total = swiperInstance.slides.length;
        targetIndex = Math.max(0, Math.min(targetIndex, total - 1));

        swiperInstance.slideTo(targetIndex, SLIDE_SPEED);
    }

    //  INIT (called when Swiper is ready)
    function init() {
        // Create hint
        createHint();
        // Attach wheel event
        widgetContainer.addEventListener('wheel', onWheel, { passive: false });
        console.log('🚀 Carousel wheel controller is active.');
    }

})();