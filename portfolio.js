// ============================================
// PORTFÓLIO CELLYSISTEMAS - INTERAÇÕES
// ============================================
document.addEventListener('DOMContentLoaded', function () {

    // ---- MENU MOBILE (HAMBURGER) ----
    const menuToggle = document.getElementById('pfMenuToggle');
    const navMenu = document.getElementById('pfNavMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
            });
        });
    }

    // ---- REVEAL AO ROLAR A PÁGINA ----
    const revealEls = document.querySelectorAll('.pf-reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        // Sem suporte a IntersectionObserver: mostra tudo direto
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    // ---- CARROSSEL DE TELAS: ARRASTAR, SETAS E BOLINHAS ----
    const carViewport = document.getElementById('pfCarrosselViewport');
    const carTrack = document.getElementById('pfCarrosselTrack');
    const carPrev = document.getElementById('pfCarPrev');
    const carNext = document.getElementById('pfCarNext');

    if (carViewport && carTrack) {
        const carItens = Array.from(carTrack.children);

        // -- arrastar com Pointer Events (funciona com mouse, dedo e caneta) --
        // usa setPointerCapture pra continuar recebendo os eventos mesmo se
        // o ponteiro sair da área do carrossel durante o arraste
        let arrastando = false;
        let posInicialX = 0;
        let scrollInicial = 0;
        let moveu = false;

        carViewport.addEventListener('pointerdown', function (e) {
            arrastando = true;
            moveu = false;
            posInicialX = e.clientX;
            scrollInicial = carViewport.scrollLeft;
            carViewport.classList.add('pf-arrastando');
            try { carViewport.setPointerCapture(e.pointerId); } catch (err) {}
        });

        carViewport.addEventListener('pointermove', function (e) {
            if (!arrastando) return;
            const distancia = e.clientX - posInicialX;
            if (Math.abs(distancia) > 5) {
                moveu = true;
                e.preventDefault();
            }
            carViewport.scrollLeft = scrollInicial - distancia;
        });

        function pararArraste(e) {
            if (!arrastando) return;
            arrastando = false;
            carViewport.classList.remove('pf-arrastando');
            try { carViewport.releasePointerCapture(e.pointerId); } catch (err) {}
        }

        carViewport.addEventListener('pointerup', pararArraste);
        carViewport.addEventListener('pointercancel', pararArraste);

        // evita que o clique "vaze" pro link/imagem depois de arrastar
        carViewport.addEventListener('click', function (e) {
            if (moveu) { e.preventDefault(); e.stopPropagation(); }
        }, true);

        // -- setas --
        function distanciaDoItem() {
            if (!carItens.length) return 280;
            const estilo = getComputedStyle(carTrack);
            return carItens[0].offsetWidth + parseFloat(estilo.gap || 24);
        }

        if (carPrev) {
            carPrev.addEventListener('click', function () {
                carViewport.scrollBy({ left: -distanciaDoItem(), behavior: 'smooth' });
            });
        }

        if (carNext) {
            carNext.addEventListener('click', function () {
                carViewport.scrollBy({ left: distanciaDoItem(), behavior: 'smooth' });
            });
        }

    }

    // ---- FORMULÁRIO DE CONTATO -> WHATSAPP ----
    const form = document.getElementById('pfContatoForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome = document.getElementById('pfNome').value.trim();
            const email = document.getElementById('pfEmail').value.trim();
            const whats = document.getElementById('pfWhats').value.trim();
            const mensagem = document.getElementById('pfMensagem').value.trim();

            let texto = 'Olá! Vim pelo site da CellySistemas.\n';
            texto += 'Nome: ' + nome + '\n';
            texto += 'E-mail: ' + email + '\n';
            if (whats) texto += 'WhatsApp: ' + whats + '\n';
            texto += 'Mensagem: ' + mensagem;

            const url = 'https://wa.me/5521966729503?text=' + encodeURIComponent(texto);
            window.open(url, '_blank', 'noopener');
        });
    }

});
