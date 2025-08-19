document.addEventListener('DOMContentLoaded', function () {
    
    /**
     * Sets the 'active' class on the correct navigation link based on the current page URL.
     * This is necessary for multi-page sites to show the user which page they are on.
     */
    const setActiveLink = () => {
        const navLinks = document.querySelectorAll('.nav-link');
        // Get the current page filename (e.g., "index.html", "about.html")
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            
            // Remove active class from all links first to reset state
            link.classList.remove('active');
            
            // Add active class if the link's href matches the current page
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    };

    /**
     * Initializes the Particles.js animation on the hero section.
     * It first checks if the #particles-js element exists to ensure it only runs on the homepage.
     */
    const initParticles = () => {
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            // If a particle instance already exists, destroy it before creating a new one
            if (window.pJSDom && window.pJSDom.length > 0) {
                window.pJSDom[0].pJS.fn.vendors.destroypJS();
                window.pJSDom = []; // Explicitly clear the array to prevent stale references
            }

            // Determine particle color based on the current theme
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const particleColor = currentTheme === 'light' ? '#333333' : '#ffffff'; // Dark particles for light theme

            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 45,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": particleColor
                    },
                    "shape": {
                        "type": "polygon",
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.3,
                        "random": true
                    },
                    "size": {
                        "value": 10,
                        "random": true
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 200,
                        "color": particleColor,
                        "opacity": 0.3,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 1,
                        "direction": "none",
                        "random": true,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_opacity": 1
                        },
                        "push": {
                            "particles_nb": 4
                        }
                    }
                },
                "retina_detect": true
            });
        }
    };

    // Listen for the custom 'themeChanged' event from main.js
    document.addEventListener('themeChanged', () => {
        // Re-initialize particles to update their color for the new theme
        initParticles();
    });

    // Initialize all functions
    setActiveLink();
    initParticles();

});
