window.addEventListener('load', () => {
    // --- Element References ---
    const loader = document.getElementById('loader');
    const loaderLogo = document.getElementById('loader-logo');
    const mainLogo = document.getElementById('main-logo'); 
    const body = document.body;
    const centeredContent = document.querySelector('.centered-content');
    const mainTitles = centeredContent ? centeredContent.querySelectorAll('h1.main-title') : [];
    const scrollContainer = document.querySelector('.scroll-container'); 

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

    // --- HOME Button Transition (Simple Fade & Scroll) --- //
    const homeButton = document.querySelector('.menu-button');
    const section1 = document.getElementById('home');
    const section2 = document.getElementById('services');
    const footerNav = document.querySelector('.footer-nav');

    if (homeButton && section1 && section2 && footerNav && scrollContainer) {
        homeButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir comportamiento por defecto

            console.log("HOME clicked, starting simple fade & scroll transition...");

            // 1. Iniciar desvanecimiento de Sección 1 y Footer Nav
            section1.classList.add('is-hidden');
            footerNav.classList.add('is-hidden'); // Ocultar footer temporalmente

            // 2. Esperar un breve momento para que el desvanecimiento comience
            //    antes de iniciar el scroll.
            setTimeout(() => {
                console.log("Scrolling smoothly to Section 2...");

                // 3. Scroll suave a Sección 2
                section2.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // 4. Gestionar estado del footer DESPUÉS del scroll (ESTIMADO)
                //    El observer se encargará de S1 y del footer al cambiar de sección
                setTimeout(() => {
                    console.log("Scroll likely complete. Setting footer state for S2.");

                    // Decidir qué hacer con el footer en Sección 2:
                    // Opción A: Ocultarlo permanentemente en S2
                    footerNav.classList.add('hidden-in-s2');
                    footerNav.classList.remove('is-hidden'); // Quitar clase temporal

                    // Opción B: Mostrarlo en S2 (quitar línea anterior y esta)
                    // footerNav.classList.remove('is-hidden');

                    // YA NO quitamos 'is-hidden' de section1 aquí. El observer lo hará.

                }, 700); // Ajustar tiempo estimado

            }, 100); // Pequeño retraso antes de scrollear (100ms)

        });
    } else {
        console.error("Error: No se encontraron todos los elementos necesarios para la transición HOME (simple + observer). Check .scroll-container, .menu-button, #home, #services, .footer-nav");
    }

    // --- Intersection Observer para gestionar visibilidad de secciones ---
    if (scrollContainer && section1 && section2 && footerNav) { 
        // Opciones para el observer: Detectar cuando al menos el 50% de la sección es visible
        const observerOptions = {
            root: scrollContainer, // Observar dentro del contenedor de scroll
            rootMargin: '0px',
            threshold: 0.5 // Se activa cuando el 50% está visible/invisible
        };

        // Callback que se ejecuta cuando cambia la intersección
        const intersectionCallback = (entries) => {
            entries.forEach(entry => {
                // entry.target es el elemento observado (section1 o section2)
                // entry.isIntersecting indica si cumple el threshold (50% visible)

                if (entry.target.id === 'home') {
                    if (entry.isIntersecting) {
                        // --- Sección 1 ES VISIBLE ---
                        console.log("Section 1 is visible again.");
                        // Quitar la clase 'is-hidden' para que sea visible
                        entry.target.classList.remove('is-hidden');
                        // Mostrar el footer nav asociado a Sección 1
                        footerNav.classList.remove('is-hidden');
                        footerNav.classList.remove('hidden-in-s2'); // Quitar clase de ocultar en S2
                    } else {
                        // --- Sección 1 NO ES VISIBLE ---
                        // No hacemos nada aquí directamente, el click en HOME la oculta
                        // console.log("Section 1 is NOT visible.");
                    }
                } else if (entry.target.id === 'services') {
                    if (entry.isIntersecting) {
                        // --- Sección 2 ES VISIBLE ---
                        console.log("Section 2 is visible.");
                        // Asegurarse que S1 esté oculta si venimos del click en HOME
                        // (La lógica del click ya la oculta, pero esto es una doble verificación)
                        // if (!section1.classList.contains('is-hidden')) {
                        //     // Esto podría ocultarla también con scroll manual, quizás no deseado
                        // }

                        // Decidir qué hacer con el footer aquí:
                        // Si se ocultó al llegar a S2, mantenerlo oculto
                        if (footerNav.classList.contains('hidden-in-s2')) {
                            // Ya está oculto, no hacer nada
                        } else {
                            // Si no se ocultó, asegurarse de que no tenga la clase is-hidden temporal
                            footerNav.classList.remove('is-hidden');
                        }

                    } else {
                        // --- Sección 2 NO ES VISIBLE ---
                        // console.log("Section 2 is NOT visible.");
                    }
                }
            });
        };

        // Crear el observer
        const observer = new IntersectionObserver(intersectionCallback, observerOptions);

        // Empezar a observar las secciones
        observer.observe(section1);
        observer.observe(section2);

    } else {
         console.error("Error: No se pudieron inicializar el Intersection Observer. Faltan elementos clave (scrollContainer, section1, section2, footerNav).");
    }
    // --- Fin de Intersection Observer ---

    // --- Placeholder for Horizontal Scroll --- //
    const scrollWrapper = document.querySelector('.services-scroll-wrapper');
    if (scrollWrapper) {
        console.log("Horizontal scroll container found. Basic scroll enabled via CSS.");
    }

});