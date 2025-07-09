// script.js (Versão Final com TODAS as Correções e Melhorias de Performance e Partículas)

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); 

// === DEFINIÇÃO DA CLASSE PARTICLE ===
class Particle {
    constructor(canvas, ctx, isSpark = false, x = null, y = null, color = null) { 
        this.canvas = canvas;
        this.ctx = ctx;
        
        this.isSpark = isSpark;
        if (this.isSpark) {
            this.x = x; // Posição X da explosão
            this.y = y; // Posição Y da explosão
            this.size = Math.random() * 3 + 1; 
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 3; 
            this.speedX = Math.cos(angle) * speed; 
            this.speedY = Math.sin(angle) * speed;
            this.opacity = 1;
            this.color = color || `rgba(255, 255, 200, ${this.opacity})`;
            this.life = 60 + Math.random() * 60; 
            this.initialLife = this.life; 
            this.remove = false; 
        } else {
            // Partículas de fundo: posição inicial aleatória dentro das dimensões do canvas
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height; 
            this.size = Math.random() * 1.5 + 0.5; 
            this.speedX = (Math.random() - 0.5) * 0.5; 
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.8 + 0.2; 
            this.color = `rgba(255, 255, 200, ${this.opacity})`;
            this.remove = false;
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.isSpark) {
            this.life--;
            this.speedY += 0.1; 
            this.opacity = this.life / this.initialLife; 
            if (this.opacity < 0.05 || this.life <= 0) { 
                this.remove = true; 
            }
        } else {
            if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
            this.opacity += (Math.random() - 0.5) * 0.02; 
            if (this.opacity > 0.8) this.opacity = 0.8;
            if (this.opacity < 0.2) this.opacity = 0.2;
        }
        const [r, g, b] = this.color.match(/\d+/g).map(Number); 
        this.color = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.shadowColor = this.isSpark ? this.color : 'rgba(255, 255, 200, 0.8)';
        this.ctx.shadowBlur = this.isSpark ? 2 : 5; 
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
// === FIM DA DEFINIÇÃO DA CLASSE PARTICLE ===


document.addEventListener('DOMContentLoaded', () => {

    // --- Efeito de Partículas Brilhantes no Hero (Canvas) ---
    const heroSection = document.querySelector('.hero');
    let canvas, ctx, particles = [];
    const numParticlesBackground = 80; 
    let animationFrameId;

    if (heroSection) { 
        canvas = document.getElementById('particle-canvas');
        if (!canvas) { 
            canvas = document.createElement('canvas');
            canvas.id = 'particle-canvas';
            heroSection.prepend(canvas);
        }

        ctx = canvas.getContext('2d');
        
        function initializeParticles() {
            // Limpa as partículas existentes (garante que não haja duplicatas)
            particles = []; 
            // Adiciona as partículas de fundo
            for (let i = 0; i < numParticlesBackground; i++) {
                particles.push(new Particle(canvas, ctx)); 
            }
            // Log para debug: Verifique a altura do canvas
            console.log("Canvas initialized. Width:", canvas.width, "Height:", canvas.height);
        }

        function resizeCanvas() {
            if (!canvas || !heroSection || !ctx) return; 
            // Atualiza as dimensões do canvas para corresponder à seção hero
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            // Ao redimensionar, recria *apenas* as partículas de fundo para que se espalhem corretamente
            // As faíscas existentes (isSpark = true) serão filtradas pela função animateParticles
            particles = particles.filter(p => p.isSpark); // Remove as antigas partículas de fundo
            for (let i = 0; i < numParticlesBackground; i++) {
                particles.push(new Particle(canvas, ctx)); 
            }
            console.log("Canvas resized. Width:", canvas.width, "Height:", canvas.height);
        }

        // Chama resizeCanvas uma vez para configurar o tamanho inicial e as partículas
        resizeCanvas(); // Garante que as partículas sejam criadas com as dimensões corretas.

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 250); 
        });

        function animateParticles() {
            if (!ctx) return; 
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            particles = particles.filter(p => !p.remove); 

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
        const startY = window.innerHeight; 
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * window.innerHeight * 0.3; 

        const sparkColors = ['255,159,67', '254,202,87', '72,219,251', '104,109,224', '29,209,161'];
        const numSparks = 30 + Math.random() * 20; 

        gsap.fromTo(firework,
            { 
                x: startX,
                y: startY,
                opacity: 0.8, 
                scale: 0.5 
            },
            { 
                x: endX,
                y: endY,
                opacity: 1, 
                scale: 1, 
                duration: Math.random() * 0.5 + 0.8,
                ease: "power2.out",
                onComplete: () => {
                    if (canvas && ctx && particles) { 
                        for (let i = 0; i < numSparks; i++) {
                            const randomColorRgb = sparkColors[(Math.random() * sparkColors.length) | 0];
                            // Adiciona as faíscas ao array global de partículas
                            particles.push(new Particle(canvas, ctx, true, endX, endY, `rgba(${randomColorRgb}, 1)`));
                        }
                    }
                    firework.remove(); 
                }
            }
        );
    }
    // --- FIM DAS FUNÇÕES DE FOGOS DE ARTIFÍCIO ---


    // --- ANIMAÇÕES DA SEÇÃO HERO ---
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDate = document.querySelector('.hero-date');
    const heroContent = document.querySelector('.hero-content'); 
    const customNavbar = document.querySelector('.custom-navbar'); 

    if (heroTitle && heroSubtitle && heroDate && heroContent) { 
        const masterTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });

        masterTimeline
            .fromTo(heroTitle, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.5 })
            .fromTo(heroSubtitle, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: -0.8 }, "<") 
            .fromTo(heroDate, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: -0.7 }, "<") 
            .fromTo(heroContent, 
                { opacity: 0, y: 50, scale: 0.95 }, 
                { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out" }, "-=0.5" 
            )
            .from(".hero-content .verse-text-hero", { y: "20%", opacity: 0, duration: 1 }, "<0.3") 
            .from(".hero-content .verse-reference-hero", { y: "20%", opacity: 0, duration: 1 }, "<0.4")
            .from(".hero-content .btn", { y: "10%", opacity: 0, duration: 1 }, "<0.5");

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
        const targetDate = new Date('2025-07-09T14:40:00-03:00'); // Ajuste para alguns segundos no futuro para teste!
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

                if (paddedNewValue !== currentValue) {
                    gsap.fromTo(element,
                        { scale: 1.2, opacity: 0.5, textShadow: "0 0 10px var(--accent-color)" },
                        { scale: 1, opacity: 1, textShadow: "none", duration: 0.4, ease: "back.out(1.7)" }
                    );
                    element.textContent = paddedNewValue; 
                }
            }

            if (distance < 0) {
                clearInterval(x);

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

                            gsap.to(countdownFinishedMessage, {
                                opacity: 1,
                                scale: 1.2,
                                duration: 0.8,
                                ease: "elastic.out(1, 0.5)",
                                onComplete: () => {
                                    gsap.to(countdownFinishedMessage, {
                                        scale: 1,
                                        duration: 1.5,
                                        yoyo: true,
                                        repeat: -1,
                                        ease: "power1.inOut"
                                    });
                                }
                            });

                            for (let i = 0; i < 50; i++) { 
                                setTimeout(() => createFirework(), i * 200); 
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