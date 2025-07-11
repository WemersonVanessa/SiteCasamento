// script.js (Versão Final com todas as melhorias)

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA UNIFICADA DAS PARTÍCULAS ---
    class Particle {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.6 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
        }
        draw() {
            this.ctx.fillStyle = `rgba(255, 255, 215, ${this.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    function initParticleSystem(containerSelector, canvasId, particleCount) {
        const section = document.querySelector(containerSelector);
        if (!section) return;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const setup = () => {
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas, ctx));
            }
        };
        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };
        setup();
        animate();
        window.addEventListener('resize', setup);
    }

    initParticleSystem('.hero', 'particle-canvas', 80);
    initParticleSystem('footer', 'footer-particle-canvas', 50);


    // --- ANIMAÇÕES DA SEÇÃO HERO ---
    const customNavbar = document.querySelector('.custom-navbar');
    gsap.timeline({ defaults: { ease: "power2.out" } })
        .fromTo(".hero-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.5 })
        .fromTo(".hero-subtitle", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: -0.8 }, "<")
        .fromTo(".hero-date", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: -0.7 }, "<")
        .fromTo(".hero-content", { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out" }, "-=0.5");

    // --- CONTAGEM REGRESSIVA ---
    const countdownElement = document.getElementById("countdown");
    if(countdownElement) {
        const countdownSpans = {
            days: document.getElementById("days"),
            hours: document.getElementById("hours"),
            minutes: document.getElementById("minutes"),
            seconds: document.getElementById("seconds")
        };
        const targetDate = new Date('2025-09-06T16:00:00-03:00');
        const countdownDateMs = targetDate.getTime();
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = countdownDateMs - now;
            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.style.display = 'none';
                document.getElementById('countdown-message').classList.remove('d-none');
                return;
            }
            countdownSpans.days.textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
            countdownSpans.hours.textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            countdownSpans.minutes.textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            countdownSpans.seconds.textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
        };
        let countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }
    
    // --- LÓGICA DO CARROSSEL ---
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slide = carouselContainer.querySelector('.carousel-slide');
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');
        const images = [...slide.querySelectorAll('img')];
        const prevBtn = carouselContainer.querySelector('.carousel-btn.prev');
        const nextBtn = carouselContainer.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        if (slide && dotsContainer && images.length > 0) {
            images.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.addEventListener('click', () => { goToSlide(i); });
                dotsContainer.appendChild(dot);
            });
            const dots = dotsContainer.querySelectorAll('.dot');
            
            const updateControls = (index) => {
                currentIndex = index;
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[currentIndex]) {
                    dots[currentIndex].classList.add('active');
                }
                prevBtn.classList.toggle('disabled', currentIndex === 0);
                nextBtn.classList.toggle('disabled', currentIndex === images.length - 1);
            };

            const goToSlide = (index) => {
                const imageWidth = images[0].offsetWidth;
                gsap.to(slide, {
                    duration: 0.8,
                    scrollTo: { x: imageWidth * index, autoKill: false },
                    ease: "power2.inOut"
                });
                updateControls(index);
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = images.indexOf(entry.target);
                        updateControls(index);
                    }
                });
            }, { root: slide, threshold: 0.51 });

            images.forEach(img => observer.observe(img));

            if(prevBtn) prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                }
            });

            if(nextBtn) nextBtn.addEventListener('click', () => {
                if (currentIndex < images.length - 1) {
                    goToSlide(currentIndex + 1);
                }
            });

            updateControls(0);
        }
    }

    // --- ANIMAÇÃO DAS SEÇÕES AO ROLAR ---
    gsap.utils.toArray("section").forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 175,
            rotationX: -10,
            transformOrigin: "center bottom",
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse",
            }
        });
    });

    // --- EFEITOS DE HOVER NOS BOTÕES ---
    document.querySelectorAll(".btn, .carousel-btn").forEach(button => {
        button.addEventListener("mouseenter", () => {
            gsap.to(button, { scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)", duration: 0.3, ease: "power1.out" });
        });
        button.addEventListener("mouseleave", () => {
            gsap.to(button, { scale: 1, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)", duration: 0.3, ease: "power1.out" });
        });
    });
    
    // --- SMOOTH SCROLL PARA NAVBAR ---
    document.querySelectorAll('.navbar-nav .nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            gsap.to(window, {
                duration: 1.5,
                scrollTo: { y: targetId, offsetY: 100 },
                ease: "power3.inOut",
                onComplete: () => {
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        new bootstrap.Collapse(navbarCollapse).hide();
                    }
                }
            });
        });
    });

    // --- ANIMAÇÃO DA NAVBAR AO ROLAR ---
    if (customNavbar) {
        gsap.to(customNavbar, {
            paddingTop: '0.8rem', paddingBottom: '0.8rem', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', ease: 'power1.out',
            scrollTrigger: {
                trigger: 'body', start: 'top -80px', end: 'top -80px',
                toggleActions: 'play none none reverse', scrub: 0.5
            }
        });
    }

    // --- BOTÃO PIX ---
    const pixButton = document.getElementById('copyPixBtn');
    if(pixButton) {
        const pixCodeInput = document.getElementById('pixCode');
        const copyMessageElement = document.getElementById('copyMessage');
        gsap.set(copyMessageElement, { opacity: 0, scale: 0.8, y: -10, visibility: 'hidden' });
        pixButton.addEventListener('click', function () {
            if (gsap.isTweening(copyMessageElement)) return;
            const keyToCopy = pixCodeInput.value;
            if (!keyToCopy || keyToCopy === "SUA_CHAVE_PIX_AQUI") {
                alert("A chave Pix não foi definida no campo HTML.");
                return;
            }
            navigator.clipboard.writeText(keyToCopy).then(() => {
                gsap.timeline().to(copyMessageElement, {
                    duration: 0.4, opacity: 1, scale: 1, y: 0, visibility: 'visible', ease: 'back.out(1.7)'
                }).to(copyMessageElement, {
                    duration: 0.4, opacity: 0, scale: 0.8, y: -10, ease: 'power2.in', delay: 1.8
                });
            }).catch(err => {
                console.error('Erro ao tentar copiar a chave Pix: ', err);
                alert('Não foi possível copiar a chave. Por favor, copie manualmente: ' + keyToCopy);
            });
        });
    }

    // --- ADICIONAR AO CALENDÁRIO ---
    const addToCalendarBtn = document.getElementById('addToCalendarBtn');
    if (addToCalendarBtn) {
        addToCalendarBtn.addEventListener('click', () => {
            const eventTitle = "Casamento de Vanessa & Wemerson";
            const eventDescription = "Venha celebrar conosco a união de Vanessa e Wemerson!";
            const eventLocation = "Salão de Festas Aquários - Ceilândia, Brasília - DF";
            const eventStart = new Date('2025-09-06T16:00:00-03:00');
            const formatDateTime = (date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');
            const startTime = formatDateTime(eventStart);
            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${startTime}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}&sf=true&output=xml`;
            window.open(googleCalendarUrl, '_blank');
        });
    }
    
    // --- LÓGICA PARA ATIVAR LINKS DO MENU COM SCROLL ---
    const sections = gsap.utils.toArray('section[id]');
    const navLinks = gsap.utils.toArray('.navbar-nav .nav-link');
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onToggle: self => {
                const id = section.getAttribute('id');
                const correspondingLink = document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`);
                if(self.isActive) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if(correspondingLink) correspondingLink.classList.add('active');
                } else {
                    if(correspondingLink) correspondingLink.classList.remove('active');
                }
            }
        });
    });
});