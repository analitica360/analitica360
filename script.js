document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================================
       HEADER — Efecto scroll
       =================================================================== */
    const header = document.getElementById('sitio-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    /* ===================================================================
       MENÚ HAMBURGUESA
       =================================================================== */
    const btnHamburguesa = document.querySelector('.menu-hamburguesa');
    const menuMovil      = document.getElementById('menuMovil');
    const enlacesMoviles = document.querySelectorAll('.enlace-movil');

    function toggleMenu(forzarCerrar = false) {
        const estaAbierto = !forzarCerrar && !menuMovil.classList.contains('abierto');
        menuMovil.classList.toggle('abierto', estaAbierto);
        btnHamburguesa.classList.toggle('abierto', estaAbierto);
        btnHamburguesa.setAttribute('aria-expanded', estaAbierto);
        document.body.style.overflow = estaAbierto ? 'hidden' : '';
    }

    btnHamburguesa.addEventListener('click', () => toggleMenu());

    enlacesMoviles.forEach(enlace => {
        enlace.addEventListener('click', () => toggleMenu(true));
    });

    /* ===================================================================
       FAQ — Acordeón, una pregunta abierta a la vez
       =================================================================== */
    const preguntas = document.querySelectorAll('.faq-pregunta');

    preguntas.forEach(pregunta => {
        pregunta.addEventListener('click', () => {
            const estaActiva = pregunta.classList.contains('active');

            preguntas.forEach(otra => {
                otra.classList.remove('active');
                otra.nextElementSibling.style.maxHeight = null;
            });

            if (!estaActiva) {
                pregunta.classList.add('active');
                pregunta.nextElementSibling.style.maxHeight =
                    pregunta.nextElementSibling.scrollHeight + 'px';
            }
        });
    });

    /* ===================================================================
       ANIMACIONES DE SCROLL — IntersectionObserver
       =================================================================== */
    const elementosAnimados = document.querySelectorAll('.animar');

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    elementosAnimados.forEach(el => observador.observe(el));

    /* ===================================================================
       FORMULARIO — Envío con feedback visual
       =================================================================== */
    const formulario = document.getElementById('formulario-leads');
    const btnEnviar  = document.getElementById('btn-enviar');
    const btnTexto   = document.getElementById('btn-texto');
    const btnSpinner = document.getElementById('btn-spinner');
    const msgExito   = document.getElementById('mensaje-exito');
    const msgError   = document.getElementById('mensaje-error');

    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();

            btnEnviar.disabled = true;
            btnTexto.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
            msgExito.style.display = 'none';
            msgError.style.display = 'none';

            try {
                const respuesta = await fetch(formulario.action, {
                    method: 'POST',
                    body: new FormData(formulario)
                });

                if (respuesta.ok) {
                    formulario.style.display = 'none';
                    msgExito.style.display = 'flex';
                } else {
                    throw new Error('Error en el servidor');
                }
            } catch (err) {
                btnEnviar.disabled = false;
                btnTexto.style.display = 'inline';
                btnSpinner.style.display = 'none';
                msgError.style.display = 'flex';
            }
        });
    }

    /* ===================================================================
       VALIDACIÓN TELÉFONO
       =================================================================== */
    const campoTelefono = document.getElementById('campo-telefono');
    const errorTelefono = document.getElementById('error-telefono');

    if (campoTelefono) {
        campoTelefono.addEventListener('blur', () => {
            const digits = campoTelefono.value.replace(/\D/g, '');
            if (digits.length < 7) {
                errorTelefono.style.display = 'block';
                campoTelefono.style.borderColor = 'rgba(255,95,86,0.5)';
            } else {
                errorTelefono.style.display = 'none';
                campoTelefono.style.borderColor = 'rgba(41,199,246,0.4)';
            }
        });

        campoTelefono.addEventListener('input', () => {
            if (errorTelefono.style.display === 'block') {
                const digits = campoTelefono.value.replace(/\D/g, '');
                if (digits.length >= 7) {
                    errorTelefono.style.display = 'none';
                    campoTelefono.style.borderColor = 'rgba(41,199,246,0.4)';
                }
            }
        });
    }

    /* ===================================================================
       BANNER DE COOKIES
       =================================================================== */
    const bannerCookies = document.getElementById('banner-cookies');
    const btnAceptar    = document.getElementById('aceptar-cookies');

    if (bannerCookies && !localStorage.getItem('cookies-aceptadas')) {
        setTimeout(() => bannerCookies.classList.add('visible'), 800);
    }

    if (btnAceptar) {
        btnAceptar.addEventListener('click', () => {
            localStorage.setItem('cookies-aceptadas', 'true');
            bannerCookies.classList.remove('visible');
        });
    }

});
