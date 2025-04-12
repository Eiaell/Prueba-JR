window.addEventListener('load', () => {
    // --- Element References ---
    const loader = document.getElementById('loader');
    const loaderLogo = document.getElementById('loader-logo');
    const mainLogo = document.getElementById('main-logo'); 
    const body = document.body;
    const centeredContent = document.querySelector('.centered-content');
    const mainTitles = centeredContent ? centeredContent.querySelectorAll('h1.main-title') : [];

    // --- Title Fade Effect Variables ---
    let currentTitleIndex = 0;
    let titleInterval;
    const titleDisplayTime = 2000; 

    // --- Initial Checks ---
    if (!loader || !loaderLogo || !mainLogo || !body || !centeredContent || mainTitles.length === 0) {
        console.error("Error: Essential elements missing on load!");
        if(loader) loader.style.display = 'none';
        if(body) body.classList.add('loaded');
        return;
    }

    // --- Loader Display & Transition --- //
    const loaderDuration = 2500; 

    setTimeout(() => {
        // 1. Fade out loader background and loader logo
        loader.classList.add('hidden');
        loaderLogo.classList.add('hidden');

        // 2. Fade in main content (body)
        body.classList.add('loaded');

        // 3. Fade in main logo
        mainLogo.classList.add('visible');

        // 4. Start Title Cycling AFTER the main content is visible
        startTitleCycling();

        // 5. Optionally remove the loader from DOM after transition
        loader.addEventListener('transitionend', () => {
            loader.remove();
        }, { once: true });

    }, loaderDuration);

    // --- Title Cycling Function --- //
    function cycleTitles() {
        if (mainTitles.length === 0) {
            clearInterval(titleInterval);
            return;
        }

        mainTitles[currentTitleIndex].classList.remove('visible');
        currentTitleIndex = (currentTitleIndex + 1) % mainTitles.length;
        mainTitles[currentTitleIndex].classList.add('visible');
    }

    // --- Function to Start Title Cycling --- //
    function startTitleCycling() {
         if (mainTitles.length > 0) {
            clearInterval(titleInterval); 
            mainTitles[0].classList.add('visible'); 
            titleInterval = setInterval(cycleTitles, titleDisplayTime);
        } else {
            console.warn("No main titles found to start cycling.");
        }
    }

    // --- Smooth Scrolling for Anchor Links --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement && targetId.length > 1) {
               // Default behavior is usually sufficient with scroll-snap
            }
        });
    });

    // --- Placeholder for Menu Button --- //
    const menuButton = document.querySelector('.menu-button');
    if(menuButton) {
        menuButton.addEventListener('click', () => {
            console.log("Menu button clicked - Implement navigation toggle here.");
        });
    }

    // --- Placeholder for Horizontal Scroll --- //
    const scrollWrapper = document.querySelector('.services-scroll-wrapper');
    if (scrollWrapper) {
        console.log("Horizontal scroll container found. Basic scroll enabled via CSS.");
    }

});