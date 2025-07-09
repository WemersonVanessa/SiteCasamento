// script.js (Versão Final com TODAS as Correções e Melhorias)

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); 

// === DEFINIÇÃO DA CLASSE PARTICLE ===
class Particle {
    constructor(canvas, ctx) { 
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 1.5 + 0.5; 
        this.speedX = (Math.random() - 0.5) * 0.5; 
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.8 + 0.2; 
        this.color = `rgba(255, 255, 200, ${this.opacity})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Inverte a direção se a partícula atingir as bordas
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;

        // Variação sutil na opacidade
        this.opacity += (Math.random() - 0.5) * 0.02;
        if (this.opacity > 0.8) this.opacity = 0.8;
        if (this.opacity < 0.2) this.opacity = 0.2;
        this.color = `rgba(255, 255, 200, ${this.opacity})`;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.shadowColor = 'rgba(255, 255, 200, 0.8)';
        this.ctx.shadowBlur = 5; 
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
// === FIM DA DEFINIÇÃO DA CLASSE PARTICLE ===


document.addEventListener('DOMContentLoaded', () => {

    // --- Efeito de Partículas Brilhantes no Hero (Canvas) ---
    const heroSection = document.querySelector('.hero');
    if (heroSection) { 
        let canvas = document.getElementById('particle-canvas');
        if (!canvas) { 
            canvas = document.createElement('canvas');
            canvas.id = 'particle-canvas';
            heroSection.prepend(canvas);
        }

        const ctx = canvas.getContext('2d');
        let particles = [];
        const numParticles = 80; 
        let animationFrameId;

        function resizeCanvas() {
            if (!canvas || !heroSection || !ctx) return; 
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            particles = []; 
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(canvas, ctx)); 
            }
        }

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 250); 
        });
        resizeCanvas(); 

        function animateParticles() {
            if (!ctx) return; 
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- FUNÇÕES DE FOGOS DE ARTIFÍCIO ---
    function createFirework() {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        document.body.appendChild(firework);

        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight; // Começa da parte inferior da tela
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * window.innerHeight * 0.3; // Altura onde explode (ex: 30% do topo)

        const colors = ['#ff9f43', '#feca57', '#48dbfb', '#686de0', '#1dd1a1'];
        const numParticles = 30 + Math.random() * 20;

        // **CORREÇÃO APLICADA AQUI: Usando gsap.fromTo para definir a animação de subida**
        gsap.fromTo(firework,
            { // Propriedades INICIAIS (FROM)
                x: startX,
                y: startY,
                opacity: 0.8, // Torna o projétil visível ao iniciar
                scale: 0.5 // Começa menor
            },
            { // Propriedades FINAIS (TO)
                x: endX,
                y: endY,
                opacity: 1, // Torna-se totalmente opaco ao subir
                scale: 1, // Aumenta o tamanho
                duration: Math.random() * 0.5 + 0.8,
                ease: "power2.out",
                onComplete: () => {
                    // Cria as partículas da explosão
                    for (let i = 0; i < numParticles; i++) {
                        createSpark(endX, endY, colors);
                    }
                    firework.remove();
                }
            }
        );
    }

    function createSpark(x, y, colors) {
        const spark = document.createElement('div');
        spark.classList.add('spark');
        // Define a posição inicial da faísca para onde o fogo de artifício explodiu
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        document.body.appendChild(spark);

        const color = colors[(Math.random() * colors.length) | 0];
        spark.style.backgroundColor = color;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 3;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        gsap.to(spark, {
            x: velocityX * 20, // Multiplicar por um fator para espalhar mais
            y: velocityY * 20, // Multiplicar por um fator para espalhar mais
            opacity: 0,
            duration: Math.random() * 0.8 + 0.5,
            ease: "power2.out",
            onComplete: () => {
                spark.remove();
            }
        });
    }
    // --- FIM DAS FUNÇÕES DE FOGOS DE ARTIFÍCIO ---


    // --- ANIMAÇÕES DA SEÇÃO HERO ---
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDate = document.querySelector('.hero-date');
    const heroContent = document.querySelector('.hero-content'); 
    const customNavbar = document.querySelector('.custom-navbar'); // Ainda precisamos selecionar para outras lógicas se houver

    if (heroTitle && heroSubtitle && heroDate && heroContent) { // Removido customNavbar daqui
        const masterTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });

        masterTimeline
            // **AQUI: REMOVEMOS A ANIMAÇÃO DA NAVBAR. ELA SERÁ ESTÁTICA PELO CSS.**
            // .fromTo(customNavbar, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.1 }) 

            // Animação inicial para os elementos do Hero (título, subtítulo, data)
            .fromTo(heroTitle, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.5 }) // delay original ajustado
            .fromTo(heroSubtitle, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: -0.8 }, "<") 
            .fromTo(heroDate, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: -0.7 }, "<") 

            // Animação para a caixa de conteúdo (versículo e botão)
            .fromTo(heroContent, 
                { opacity: 0, y: 50, scale: 0.95 }, 
                { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out" }, "-=0.5" 
            )
            // Animação dos elementos DENTRO da caixa de conteúdo
            .from(".hero-content .verse-text-hero", { y: "20%", opacity: 0, duration: 1 }, "<0.3") 
            .from(".hero-content .verse-reference-hero", { y: "20%", opacity: 0, duration: 1 }, "<0.4")
            .from(".hero-content .btn", { y: "10%", opacity: 0, duration: 1 }, "<0.5");

        // Efeito de brilho pulsante no título principal do Hero
        gsap.to(heroTitle, {
            duration: 1.5,
            textShadow: "0 0 10px #fff, 0 0 20px var(--accent-color)",
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: masterTimeline.duration() 
        });
    }

    // --- Efeito de Brilho no Hero (Overlay Dourado) ---
    const heroOverlayShine = document.querySelector(".hero-overlay-shine");
    if (heroOverlayShine) {
        gsap.to(heroOverlayShine, {
            x: "100%",
            duration: 2.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            delay: 2.5 
        });
    }

    // --- Efeito Parallax na Imagem de Fundo do Hero ---
    if (heroSection) { 
        gsap.to(heroSection, {
            backgroundPositionY: "20%", 
            ease: "none",
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top", 
                scrub: true 
            }
        });
    }

    // --- Contagem Regressiva ---
    const countdownElement = document.getElementById("countdown");
    const countdownSpans = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds")
    };
    const countdownFinishedMessage = document.getElementById('countdown-message'); 

    if (countdownElement && countdownSpans.days && countdownSpans.hours && countdownSpans.minutes && countdownSpans.seconds) {
        // Data do evento no fuso horário de Santo Antônio do Descoberto (-03)
        // ATENÇÃO: Para TESTAR os fogos de artifício, mude esta data para alguns segundos no FUTURO!
        const targetDate = new Date('2025-07-09T12:14:00-03:00'); // Exemplo: 12:05 PM de 9 de julho de 2025
        const countdownDate = targetDate.getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            function animateAndUpdate(element, newValue) {
                if (!element) return; 
                const paddedNewValue = String(newValue).padStart(2, '0');
                const currentValue = element.textContent; 

                // Somente aplica a animação e atualiza se o valor mudou
                if (paddedNewValue !== currentValue) {
                    gsap.fromTo(element,
                        { scale: 1.2, opacity: 0.5, textShadow: "0 0 10px var(--accent-color)" },
                        { scale: 1, opacity: 1, textShadow: "none", duration: 0.4, ease: "back.out(1.7)" }
                    );
                    element.textContent = paddedNewValue; 
                }
            }

            if (distance < 0) {
                clearInterval(x); // 'x' é a variável do setInterval, acessível aqui.

                // Oculta o cronômetro com animação
                gsap.to(countdownElement, {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    ease: "power2.in",
                    display: 'none',
                    onComplete: () => {
                        if (countdownFinishedMessage) {
                            countdownFinishedMessage.classList.remove('d-none');
                            countdownFinishedMessage.style.opacity = 0;
                            countdownFinishedMessage.style.transform = 'scale(0.8)';

                            // Anima a mensagem de chegada
                            gsap.to(countdownFinishedMessage, {
                                opacity: 1,
                                scale: 1.2,
                                duration: 0.8,
                                ease: "elastic.out(1, 0.5)",
                                onComplete: () => {
                                    // Adiciona um brilho sutil pulsante à mensagem
                                    gsap.to(countdownFinishedMessage, {
                                        scale: 1,
                                        duration: 1.5,
                                        yoyo: true,
                                        repeat: -1,
                                        ease: "power1.inOut"
                                    });
                                }
                            });

                            // Adiciona um efeito de fogos de artifício
                            // Você pode ajustar a quantidade de fogos aqui
                            for (let i = 0; i < 50; i++) { 
                                setTimeout(() => createFirework(), i * 200); // Dispara um fogo a cada 200ms
                            }
                        }
                    }
                });
                return;
            }

            animateAndUpdate(countdownSpans.days, days);
            animateAndUpdate(countdownSpans.hours, hours);
            animateAndUpdate(countdownSpans.minutes, minutes);
            animateAndUpdate(countdownSpans.seconds, seconds);
            
            if (countdownFinishedMessage) {
                countdownFinishedMessage.classList.add('d-none');
                countdownElement.style.display = 'flex'; 
            }
        };

        const x = setInterval(updateCountdown, 1000); 
        updateCountdown(); 
    }


    // --- Carrossel de Fotos (Galeria) ---
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselSlide = document.querySelector('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let carouselImages = []; 

    if (carouselContainer && carouselSlide && prevBtn && nextBtn) {
        carouselImages = Array.from(document.querySelectorAll('.carousel-slide img'));

        if (carouselImages.length > 0) {
            let counter = 1; 
            let size = carouselImages[0] ? carouselImages[0].clientWidth : 0; 

            carouselSlide.querySelectorAll('#firstClone, #lastClone').forEach(el => el.remove());

            const firstClone = carouselImages[0].cloneNode(true);
            const lastClone = carouselImages[carouselImages.length - 1].cloneNode(true);
            firstClone.id = 'firstClone';
            lastClone.id = 'lastClone';
            carouselSlide.appendChild(firstClone);
            carouselSlide.prepend(lastClone);

            carouselImages = Array.from(document.querySelectorAll('.carousel-slide img'));

            gsap.set(carouselSlide, { x: -size * counter });

            function slideCarousel() {
                gsap.to(carouselSlide, {
                    x: -size * counter,
                    duration: 0.8,
                    ease: "power3.inOut",
                    onStart: () => {
                        carouselImages.forEach((img, index) => {
                            if (index === counter) {
                                gsap.fromTo(img,
                                    { scale: 0.95, opacity: 0.5 },
                                    { scale: 1, opacity: 1, duration: 0.4, ease: "power1.out", delay: 0.4 }
                                );
                            } else {
                                gsap.to(img, {
                                    scale: 1,
                                    opacity: 1,
                                    duration: 0.4,
                                    ease: "power1.out"
                                });
                            }
                        });
                    },
                    onComplete: () => {
                        if (carouselImages[counter] && carouselImages[counter].id === 'lastClone') {
                            counter = carouselImages.length - 2; 
                            gsap.set(carouselSlide, { x: -size * counter });
                        }
                        if (carouselImages[counter] && carouselImages[counter].id === 'firstClone') {
                            counter = 1;
                            gsap.set(carouselSlide, { x: -size * counter });
                        }
                        gsap.to(carouselImages[counter], { scale: 1, opacity: 1, duration: 0.1 });
                    }
                });
            }

            nextBtn.addEventListener('click', () => {
                if (gsap.isTweening(carouselSlide)) return; 
                counter++;
                slideCarousel();
            });

            prevBtn.addEventListener('click', () => {
                if (gsap.isTweening(carouselSlide)) return; 
                counter--;
                slideCarousel();
            });

            let carouselResizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(carouselResizeTimeout);
                carouselResizeTimeout = setTimeout(() => {
                    size = carouselImages[0] ? carouselImages[0].clientWidth : 0; 
                    gsap.set(carouselSlide, { x: -size * counter });
                }, 250); 
            });
        }
    }


    // --- Animação de entrada das seções (ScrollTrigger) ---
    gsap.utils.toArray(".section:not(#hero)").forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: "15%",
            rotationX: -30, 
            transformOrigin: "top center",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 75%", 
                end: "bottom top", 
                toggleActions: "play none none reverse", 
            }
        });
    });

    // --- Efeitos de hover nos botões ---
    document.querySelectorAll(".btn, .carousel-btn").forEach(button => {
        button.addEventListener("mouseenter", () => {
            gsap.to(button, {
                scale: 1.1,
                boxShadow: "0 15px 35px rgba(0,0,0,0.4), 0 0 25px var(--accent-color)",
                duration: 0.3,
                ease: "back.out(2)"
            });
        });
        button.addEventListener("mouseleave", () => {
            gsap.to(button, {
                scale: 1,
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                duration: 0.3,
                ease: "power1.out"
            });
        });
        // Animação de CLICK/TAP para mobile
        button.addEventListener("click", () => {
            gsap.timeline()
                .to(button, { scale: 0.95, duration: 0.1, ease: "power1.out" }) 
                .to(button, { scale: 1, duration: 0.2, ease: "power1.out" }); 
        });
    });

    // --- Smooth Scroll para os links da Navbar ---
    document.querySelectorAll('.navbar-nav .nav-link').forEach(anchor => { 
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

             const validTargetIds = [
                '#hero', 
                '#contagem-regressiva', 
                '#localizacao', 
                '#galeria', 
                '#rsvp', 
                '#presentes'
            ];
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) { 
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: targetElement.offsetTop, 
                            autoKill: false 
                        },
                        ease: "power2.inOut",
                        onComplete: () => {
                            const navbarToggler = document.querySelector('.navbar-toggler');
                            const navbarCollapse = document.querySelector('.navbar-collapse');
                            if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
                                const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
                                bsCollapse.hide();
                            }
                        }
                    });
                }
            }
        });
    });

}); // Fim do DOMContentLoaded