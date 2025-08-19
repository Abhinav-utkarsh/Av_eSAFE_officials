document.addEventListener('DOMContentLoaded', () => {

    // --- Page Loader ---
    const loader = document.querySelector('.loader');
    window.addEventListener('load', () => {
        loader.classList.add('hidden');
    });

    // --- Sticky Header & Active Link Highlighting ---
    const header = document.querySelector('.header');

    const scrollHandler = () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', scrollHandler);

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // --- Theme Switcher ---
    const themeSwitch = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme');

    const setTheme = (theme, isInitialLoad = false) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'light') {
            themeSwitch.checked = true;
        } else {
            themeSwitch.checked = false;
        }
        // Only dispatch the event if it's a user-triggered change, not on initial page load.
        // This prevents a race condition on page load.
        if (!isInitialLoad) {
            document.dispatchEvent(new CustomEvent('themeChanged'));
        }
    };

    if (currentTheme) {
        setTheme(currentTheme, true);
    } else {
        // Default to dark theme if no preference is saved
        setTheme('dark', true);
    }

    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    // --- Scroll-triggered Animations ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', handleScrollAnimation);
    // Trigger once on load
    handleScrollAnimation();

    // --- Stats Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.stats-section');
    let activated = false;

    const runCounters = () => {
        if (statsSection && window.pageYOffset > statsSection.offsetTop - window.innerHeight && !activated) {
            activated = true;
            counters.forEach(counter => {
                counter.innerText = '0';
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                
                const updateCounter = () => {
                    const c = +counter.innerText;
                    const increment = target / 200; // Speed of animation

                    if (c < target) {
                        counter.innerText = `${Math.ceil(c + increment)}`;
                        setTimeout(updateCounter, 1);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                updateCounter();
            });
        }
    };

    // Only add the scroll listener if the stats section exists on the page
    if (statsSection) {
        window.addEventListener('scroll', runCounters);
    }

    // --- Testimonial Slider ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    // Only initialize the slider if its elements exist on the current page
    if (slides.length > 0 && nextBtn && prevBtn) {
        let currentSlide = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Auto-play slider
        setInterval(nextSlide, 7000); // Change slide every 7 seconds
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            // Show submitting status
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            formResult.style.display = 'none';

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formResult.textContent = 'Response received! We will get back to you shortly.';
                    formResult.className = 'success';
                    form.reset();
                } else {
                    console.error(data);
                    formResult.textContent = data.message || 'An error occurred. Please try again.';
                    formResult.className = 'error';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                formResult.textContent = 'An error occurred. Please try again later.';
                formResult.className = 'error';
            })
            .finally(() => {
                formResult.style.display = 'block';
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                // Hide the message after 5 seconds
                setTimeout(() => {
                    formResult.style.display = 'none';
                }, 5000);
            });
        });
    }
});