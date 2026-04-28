// Module Loader
document.addEventListener("DOMContentLoaded", () => {
    const loadComponent = async (id, url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            document.getElementById(id).innerHTML = html;
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
        }
    };

    // Initialize Layout & Plugins
    Promise.all([
        loadComponent('header-placeholder', './includes/header.html'),
        loadComponent('footer-placeholder', './includes/footer.html')
    ]).then(() => {
        const applyNavActive = () => {
            document.querySelectorAll('#navMain .nav-link').forEach(link => {
                link.classList.remove('ca-nav-active');
                link.removeAttribute('aria-current');
            });

            let path = window.location.pathname.split('/').pop() || 'index.html';
            const onIndex = path === 'index.html' || path === '' || path.endsWith('/');

            if (onIndex) {
                const raw = (window.location.hash || '#inicio').toLowerCase();
                const section = raw.length <= 1 ? 'inicio' : raw.slice(1);

                document.querySelectorAll('#navMain .nav-link').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        const id = href.slice(1).toLowerCase();
                        if (id === section) {
                            link.classList.add('ca-nav-active');
                            link.setAttribute('aria-current', 'page');
                        }
                    }
                });
            }
        };

        applyNavActive();
        window.addEventListener('hashchange', applyNavActive);

        document.querySelectorAll('#navMain .nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                const nav = document.getElementById('navMain');
                if (nav && nav.classList.contains('show') && window.bootstrap) {
                    window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
                }
            });
        });

        // AOS: sin librerías extra (GSAP/Lenis); desactivado si el usuario pide menos movimiento
        const prefersReducedMotion = () =>
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (window.AOS) {
            const reduceMotion = prefersReducedMotion();
            AOS.init({
                duration: reduceMotion ? 0 : 900,
                easing: 'ease-out-cubic',
                once: true,
                offset: 56,
                anchorPlacement: 'top-bottom',
                disable: reduceMotion
            });
            if (!reduceMotion) {
                AOS.refresh();
                window.addEventListener('hashchange', () => {
                    requestAnimationFrame(() => AOS.refresh());
                });
            }
        }
    });
});

// Form Validation (Bootstrap)
(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()