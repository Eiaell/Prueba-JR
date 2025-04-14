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

    // --- Smooth Scrolling ENHANCED for Anchor Links --- //
    // Selecciona TODOS los enlaces internos (header, footer nav, etc.)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // 1. Prevenir el comportamiento de salto instantáneo por defecto
            e.preventDefault();

            // 2. Obtener el ID del objetivo desde el href
            const targetId = this.getAttribute('href');

            // 3. Asegurarse de que no es solo un "#" vacío
            if (targetId && targetId.length > 1) {
                // 4. Encontrar el elemento objetivo en el DOM
                const targetElement = document.querySelector(targetId);

                // 5. Si el elemento existe, hacer scroll suave hacia él
                if (targetElement) {
                    console.log(`Scrolling smoothly to: ${targetId}`); // Log para depuración
                    targetElement.scrollIntoView({
                        behavior: 'smooth', // La clave para el scroll suave
                        block: 'start' // Alinea la parte superior del elemento con la parte superior del viewport
                    });
                } else {
                    console.warn(`Target element not found for selector: ${targetId}`); // Advertencia si el ID no existe
                }
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