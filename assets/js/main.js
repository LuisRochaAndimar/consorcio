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
        // --- LÓGICA DE SUBRAYADO MEJORADA ---
        // Obtenemos la página actual quitando la barra inicial y la extensión .html
        let path = window.location.pathname.split('/').pop() || 'index.html';
        const currentPage = path.replace('.html', '');

        document.querySelectorAll('#navMain .nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                // Quitamos el .html del href para comparar "manzanas con manzanas"
                const linkPage = href.replace('.html', '');
                
                if (linkPage === currentPage) {
                    link.classList.add('ca-nav-active');
                    link.setAttribute('aria-current', 'page');
                }
            }
        });
        // --- FIN LÓGICA DE SUBRAYADO ---

        // Initialize AOS only if the library is available
        if (window.AOS) {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 50
            });
            console.log("Modules loaded & AOS initialized");
        } else {
            console.warn("Modules loaded, but AOS is not available");
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