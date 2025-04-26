// Script principal para el sitio web de Johana Rodriguez
window.addEventListener('load', () => {
    // --- Referencias a elementos DOM ---
    const loader = document.getElementById('loader');
    const loaderLogo = document.getElementById('loader-logo');
    const mainLogo = document.getElementById('main-logo'); 
    const body = document.body;
    const centeredContent = document.querySelector('.centered-content');
    const mainTitles = centeredContent ? centeredContent.querySelectorAll('h1.main-title') : [];
    const scrollContainer = document.querySelector('.scroll-container'); 

    // --- Variables para el efecto de títulos ---
    let currentTitleIndex = 0;
    let titleInterval;
    const titleDisplayTime = 2000; 

    // --- Comprobaciones iniciales ---
    if (!loader || !loaderLogo || !mainLogo || !body || !centeredContent || mainTitles.length === 0) {
        console.error("Error: Elementos esenciales no encontrados al cargar!");
        if(loader) loader.style.display = 'none';
        if(body) body.classList.add('loaded');
        return;
    }

    // --- Visualización del loader y transición sincronizada con el video ---
    const loaderVideo = document.getElementById('loader-video');
    if (loaderVideo) {
        loaderVideo.addEventListener('ended', () => {
            loader.classList.add('hidden');
            body.classList.add('loaded');
            mainLogo.classList.add('visible');
            startTitleCycling();
            loader.addEventListener('transitionend', () => {
                loader.remove();
            }, { once: true });
        });
    }

    // --- Función para ciclar títulos ---
    function cycleTitles() {
        if (mainTitles.length === 0) {
            clearInterval(titleInterval);
            return;
        }

        mainTitles[currentTitleIndex].classList.remove('visible');
        currentTitleIndex = (currentTitleIndex + 1) % mainTitles.length;
        mainTitles[currentTitleIndex].classList.add('visible');
    }

    // --- Función para iniciar ciclo de títulos ---
    function startTitleCycling() {
        if (mainTitles.length > 0) {
            clearInterval(titleInterval); 
            mainTitles[0].classList.add('visible'); 
            titleInterval = setInterval(cycleTitles, titleDisplayTime);
        } else {
            console.warn("No se encontraron títulos para ciclar.");
        }
    }

    // --- Animación GEL (Squash) para botones ---
    const gelButtons = document.querySelectorAll('.main-header .menu-button, .main-header .contact-link, .footer-nav a');
    gelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('squash-gel');
            setTimeout(() => {
                this.classList.remove('squash-gel');
            }, 380);
        });
    });

    // --- Scroll suave para enlaces de anclaje ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    console.log(`Desplazando suavemente a: ${targetId}`);
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    console.warn(`Elemento objetivo no encontrado para el selector: ${targetId}`);
                }
            }
        });
    });

    // --- Transición del botón HOME ---
    const homeButton = document.querySelector('.menu-button');
    const section1 = document.getElementById('home');
    const section2 = document.getElementById('services');
    const footerNav = document.querySelector('.footer-nav');

    if (homeButton && section1 && section2 && footerNav && scrollContainer) {
        homeButton.addEventListener('click', (e) => {
            e.preventDefault();

            console.log("HOME cliqueado, iniciando transición...");

            section1.classList.add('is-hidden');
            footerNav.classList.add('is-hidden');

            setTimeout(() => {
                console.log("Desplazando suavemente a Sección 2...");

                section2.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                setTimeout(() => {
                    console.log("Desplazamiento probablemente completado. Configurando estado del footer para S2.");
                    footerNav.classList.add('hidden-in-s2');
                    footerNav.classList.remove('is-hidden');
                }, 700);

            }, 100);
        });
    } else {
        console.error("Error: No se encontraron todos los elementos necesarios para la transición HOME.");
    }

    // --- Intersection Observer para gestionar visibilidad de secciones ---
    if (scrollContainer && section1 && section2 && footerNav) { 
        const observerOptions = {
            root: scrollContainer,
            rootMargin: '0px',
            threshold: 0.5
        };

        const intersectionCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.target.id === 'home') {
                    if (entry.isIntersecting) {
                        console.log("Sección 1 es visible nuevamente.");
                        entry.target.classList.remove('is-hidden');
                        footerNav.classList.remove('is-hidden');
                        footerNav.classList.remove('hidden-in-s2');
                    }
                } else if (entry.target.id === 'services') {
                    if (entry.isIntersecting) {
                        console.log("Sección 2 es visible.");
                        if (footerNav.classList.contains('hidden-in-s2')) {
                            // Ya está oculto, no hacer nada
                        } else {
                            footerNav.classList.remove('is-hidden');
                        }
                    }
                }
            });
        };

        const observer = new IntersectionObserver(intersectionCallback, observerOptions);
        observer.observe(section1);
        observer.observe(section2);
    } else {
        console.error("Error: No se pudieron inicializar el Intersection Observer.");
    }

    // --- Scroll horizontal ---
    const scrollWrapper = document.querySelector('.services-scroll-wrapper');
    if (scrollWrapper) {
        console.log("Contenedor de scroll horizontal encontrado. Scroll básico habilitado a través de CSS.");
    }

    // --- Animación de estrellas ---
    const starBg = document.getElementById('star-bg');
    if (starBg && section2) {
        // Funciones para generar estrellas
        function randomBetween(a, b) {
            return Math.random() * (b - a) + a;
        }

        function createStarSVG(size) {
            return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
                <polygon class="star-shape" points="32,6 39.5,25.5 60,25.5 43,39 50,58 32,46 14,58 21,39 4,25.5 24.5,25.5"/>
                <circle class="star-glow" cx="32" cy="32" r="16"/>
            </svg>`;
        }

        function createShootingStarSVG(width = 180, height = 18, tailLen = 140) {
            return `<svg viewBox='0 0 ${width} ${height}' width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                    <linearGradient id='tail-gradient' x1='0' y1='0' x2='1' y2='0'>
                        <stop offset='0%' stop-color='#fff' stop-opacity='0.85'/>
                        <stop offset='60%' stop-color='#fff' stop-opacity='0.35'/>
                        <stop offset='100%' stop-color='#fff' stop-opacity='0'/>
                    </linearGradient>
                </defs>
                <ellipse class='head' cx='${tailLen+18}' cy='${height/2}' rx='10' ry='6'/>
                <rect class='tail-main' x='0' y='${height/2-4}' width='${tailLen}' height='8' rx='4'/>
                <rect class='tail-fade' x='${tailLen-20}' y='${height/2-3}' width='20' height='6' rx='3'/>
            </svg>`;
        }

        function spawnStar() {
            const star = document.createElement('div');
            star.className = 'star';
            const size = randomBetween(44, 78);
            star.style.width = star.style.height = size + 'px';
            star.style.left = randomBetween(0, 92) + '%';
            star.style.top = randomBetween(2, 90) + '%';
            star.innerHTML = createStarSVG(size);
            starBg.appendChild(star);
            setTimeout(() => star.remove(), 2200);
        }

        function spawnShootingStar() {
            const leftToRight = Math.random() > 0.5;
            const startY = Math.random() * 55 + 10;
            const startX = leftToRight ? -20 : 100;
            const endX = leftToRight ? 100 : -20;
            const angle = (Math.random() * 10 - 23) * (leftToRight ? 1 : -1);
            const width = 180, height = 18, tailLen = 140;

            const shooting = document.createElement('div');
            shooting.className = 'shooting-star';
            shooting.innerHTML = createShootingStarSVG(width, height, tailLen);
            shooting.style.top = `${startY}%`;
            shooting.style.left = `${startX}%`;
            shooting.style.transform = `rotate(${angle}deg)`;
            shooting.style.opacity = 1;
            shooting.style.transition = 'none';

            starBg.appendChild(shooting);
            void shooting.offsetWidth;

            shooting.style.transition = 'transform 1.7s cubic-bezier(0.35,0.7,0.5,1), opacity 0.8s';
            shooting.style.transform = `translateX(${endX-startX}vw) translateY(22vh) rotate(${angle}deg)`;

            setTimeout(() => { shooting.style.opacity = 0; }, 1400);
            setTimeout(() => shooting.remove(), 2000);
        }

        // Aparición periódica de estrellas grandes
        setInterval(() => {
            if (section2.offsetParent !== null) {
                spawnStar();
            }
        }, 2500);
        
        // Aparición de estrellas fugaces
        setInterval(() => {
            if (section2.offsetParent !== null && Math.random() < 0.65) {
                spawnShootingStar();
            }
        }, 5000);
    } else {
        console.warn("No se puede inicializar el fondo de estrellas. Elementos necesarios no encontrados.");
    }
});
