document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Scroll Spy for Navigation Active State
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // 3. GSAP Entrance Animations
    gsap.from('.hero-content > *', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.2
    });

    gsap.from('.hero-image-container', {
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.6
    });

    gsap.utils.toArray('.glass-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // 4. Formspree AJAX Submission
    const contactForm = document.getElementById("contact-form");
    const contactStatus = document.getElementById("contact-status");

    if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            contactStatus.style.display = "block";
            contactStatus.textContent = "Sending message...";
            contactStatus.style.color = "var(--on-surface-variant)";

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactStatus.textContent = "Thanks! Your message has been sent successfully.";
                    contactStatus.style.color = "var(--primary)";
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        contactStatus.textContent = data.errors.map(error => error.message).join(", ");
                    } else {
                        contactStatus.textContent = "Oops! There was a problem submitting your form.";
                    }
                    contactStatus.style.color = "#FFB4AB"; // Error color
                }
            } catch (error) {
                contactStatus.textContent = "Oops! There was a network problem submitting your form.";
                contactStatus.style.color = "#FFB4AB";
            }
            
            setTimeout(() => {
                contactStatus.style.display = "none";
            }, 5000);
        });
    }
});
