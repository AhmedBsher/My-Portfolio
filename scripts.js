// Page Loader Logic - MUST BE AT THE TOP to ensure it runs immediately
const hideLoader = () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            loader.style.display = 'none';
        }, 800);
    }
};

// Hide loader when page is loaded
window.addEventListener('load', hideLoader);
// Fallback: Hide loader after 3 seconds anyway
setTimeout(hideLoader, 3000);

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  const backToTopButton = document.getElementById("back-to-top");
  if (backToTopButton) {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  }
}

const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', function(event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// TextScramble
class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

const phrases = [
  'Mechanical Engineering',
  'Front-End Web Developer',
  'Graphic Designer',
]

const scrambleEl = document.querySelector('.text')
if (scrambleEl) {
    const fx = new TextScramble(scrambleEl)
    let counter = 0
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 800)
      })
      counter = (counter + 1) % phrases.length
    }
    next()
}

// Initialize Skills Swiper
if (document.querySelector('.skills-slider')) {
    const skillsSwiper = new Swiper('.skills-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        }
    });
}

// Scroll Reveal Logic
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('reveal-container')) {
                    const children = entry.target.querySelectorAll('.reveal');
                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.15}s`;
                        child.classList.add('active');
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));
}

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navigation = document.querySelector('.navigation');
const navLinks = document.querySelectorAll('.navigation a');
const menuOverlay = document.querySelector('.menu-overlay');
const closeNav = document.querySelector('.close-nav');

if (menuBtn && navigation) {
    const toggleMenu = (show) => {
        navigation.classList.toggle('active', show);
        if (menuOverlay) menuOverlay.classList.toggle('active', show);
        const icon = menuBtn.querySelector('i');
        if (icon) {
            if (show) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        }
    };

    menuBtn.addEventListener('click', () => {
        const isActive = navigation.classList.contains('active');
        toggleMenu(!isActive);
    });

    if (closeNav) {
        closeNav.addEventListener('click', () => toggleMenu(false));
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => toggleMenu(false));
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
}

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, .card, .skill-card, .menu-btn, .close-modal, .modal-btn, .more-details');

if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        follower.style.left = (e.clientX - 15) + 'px';
        follower.style.top = (e.clientY - 15) + 'px';
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => follower.classList.remove('cursor-active'));
    });
}

// Handle Contact Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    // Live Validation Functions
    const validators = {
        name: (value) => {
            if (!value.trim()) return 'Name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name should only contain letters';
            return '';
        },
        email: (value) => {
            if (!value.trim()) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email';
            return '';
        },
        message: (value) => {
            if (!value.trim()) return 'Message is required';
            if (value.trim().length < 10) return 'Message must be at least 10 characters';
            return '';
        }
    };

    const validateField = (input) => {
        const fieldName = input.name;
        const value = input.value;
        const container = input.parentElement;
        const errorMessage = container.querySelector('.error-message');
        const validationIcon = container.querySelector('.validation-icon');

        const error = validators[fieldName](value);

        // Remove existing classes
        input.classList.remove('valid', 'invalid');
        validationIcon.classList.remove('valid', 'invalid', 'show');
        errorMessage.classList.remove('show');

        if (error) {
            // Invalid state
            input.classList.add('invalid');
            validationIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            validationIcon.classList.add('invalid', 'show');
            errorMessage.textContent = error;
            errorMessage.classList.add('show');
            return false;
        } else if (value.trim()) {
            // Valid state (only if not empty)
            input.classList.add('valid');
            validationIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
            validationIcon.classList.add('valid', 'show');
            return true;
        }
        return false;
    };

    // Add input event listeners for real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        // Validate on input (as user types)
        input.addEventListener('input', () => {
            // Only validate if field has been touched (has value or was focused)
            if (input.value.trim() || input.classList.contains('touched')) {
                validateField(input);
            }
        });

        // Mark as touched on blur
        input.addEventListener('blur', () => {
            input.classList.add('touched');
            validateField(input);
        });

        // Validate on focus (clear errors if any)
        input.addEventListener('focus', () => {
            const container = input.parentElement;
            const errorMessage = container.querySelector('.error-message');
            errorMessage.classList.remove('show');
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields before submission
        let isValid = true;
        formInputs.forEach(input => {
            input.classList.add('touched');
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            // Shake the form to indicate error
            contactForm.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                contactForm.style.animation = '';
            }, 500);
            return;
        }

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.pointerEvents = 'none';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fa-solid fa-check"></i>';
                submitBtn.style.background = '#28a745';
                submitBtn.style.opacity = '1';
                contactForm.reset();
                
                // Reset validation states
                formInputs.forEach(input => {
                    input.classList.remove('valid', 'invalid', 'touched');
                    const container = input.parentElement;
                    const errorMessage = container.querySelector('.error-message');
                    const validationIcon = container.querySelector('.validation-icon');
                    errorMessage.classList.remove('show');
                    validationIcon.classList.remove('valid', 'invalid', 'show');
                });

                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.background = '';
                    submitBtn.style.opacity = '';
                    submitBtn.style.pointerEvents = 'auto';
                }, 3000);
            } else {
                throw new Error();
            }
        } catch (error) {
            submitBtn.innerHTML = '<span>Oops! Try again.</span><i class="fa-solid fa-circle-exclamation"></i>';
            submitBtn.style.background = '#dc3545';
            submitBtn.style.opacity = '1';
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.background = '';
                submitBtn.style.opacity = '';
                submitBtn.style.pointerEvents = 'auto';
            }, 3000);
        }
    });
}

// Add shake animation keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(styleSheet);

// Scroll Spy Logic
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (current && link.getAttribute('href').includes(current)) {
            link.classList.add('nav-active');
        }
    });
});

// Hero Particle System
const canvas = document.getElementById('hero-particles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    // Resize canvas
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = 'rgba(255, 255, 255, 0.5)';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        const numberOfParticles = (canvas.width * canvas.height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
}

// Project Modal Logic
const modal = document.getElementById('project-modal');
const projectCards = document.querySelectorAll('.project-card');
const closeModal = document.querySelector('.close-modal');
const modalOverlay = document.querySelector('.modal-overlay');

if (modal && projectCards.length > 0) {
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const data = card.dataset;
            
            // Populate Modal Content
            document.getElementById('modal-title').innerText = data.title;
            document.getElementById('modal-desc').innerText = data.desc;
            document.getElementById('modal-goal').innerText = data.goal;
            
            // Populate Tech Stack Badges
            const stackContainer = document.getElementById('modal-stack');
            stackContainer.innerHTML = '';
            data.stack.split(',').forEach(tech => {
                const span = document.createElement('span');
                span.className = 'tech-tag';
                span.innerText = tech.trim();
                stackContainer.appendChild(span);
            });

            // Populate Key Features
            const featuresList = document.getElementById('modal-features');
            featuresList.innerHTML = '';
            data.features.split(',').forEach(feature => {
                const li = document.createElement('li');
                li.innerText = feature.trim();
                featuresList.appendChild(li);
            });

            // Update Buttons
            document.getElementById('modal-demo').href = data.demo;
            document.getElementById('modal-github').href = data.github;

            // Show Modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    const closeProjectModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (closeModal) closeModal.addEventListener('click', closeProjectModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);

    // Close on Esc key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

// Project Filtering Logic
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');

if (filterButtons.length > 0 && projects.length > 0) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projects.forEach(project => {
                // Add a small delay for smoother transition
                project.style.opacity = '0';
                project.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filter === 'all' || project.dataset.category === filter) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        project.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

// Scroll Progress Bar Logic
const scrollProgress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    if(scrollProgress) {
        scrollProgress.style.width = scrolled + '%';
    }
});

// Magnetic Navigation Links
navLinks.forEach(link => {
    link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Intensity of the pull
        link.style.transition = 'none';
        link.style.setProperty('--mag-x', `${x * 0.4}px`);
        link.style.setProperty('--mag-y', `${y * 0.4}px`);
    });

    link.addEventListener('mouseleave', () => {
        link.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        link.style.setProperty('--mag-x', '0px');
        link.style.setProperty('--mag-y', '0px');
    });
});

// Soft Skills Dynamic Orbit System
const orbitItems = document.querySelectorAll('.circle-container .item');
const orbitCenter = document.querySelector('.circle-container .center');
const centerTitle = document.querySelector('.center-title');
const centerDesc = document.querySelector('.center-desc');
const orbitContainer = document.querySelector('.circle-container');

// Map of descriptions for each soft skill
const softSkillsData = {
    'stress management': {
        title: 'Resilience',
        desc: 'Thrives under pressure, maintaining clear focus and structural problem-solving in challenging situations.'
    },
    'communication skills': {
        title: 'Communication',
        desc: 'Articulates complex technical mechanical designs and code structures to non-technical stakeholders.'
    },
    'interpersonal skills': {
        title: 'Collaboration',
        desc: 'Collaborative team player who values diverse viewpoints and constructive collaboration.'
    },
    'public speaking': {
        title: 'Presentation',
        desc: 'Confident presenter of project blueprints, university research, and technical developments.'
    },
    'leadership': {
        title: 'Leadership',
        desc: 'Guiding project groups at university, organizing tasks, and keeping teams motivated and on schedule.'
    },
    'conflict management': {
        title: 'Diplomacy',
        desc: 'Resolving team disagreements constructively by focusing on mutual goals and objective solutions.'
    },
    'decision making': {
        title: 'Analysis',
        desc: 'Data-driven decision maker, analyzing options to select the most efficient engineering and code paths.'
    },
    'time management': {
        title: 'Efficiency',
        desc: 'Balances mechanical engineering academic load with self-taught front-end development milestones.'
    }
};

if (orbitContainer && orbitItems.length > 0) {
    let rotationAngle = 0;
    let isOrbitHovered = false;

    // Track active hovered item in JS to adjust radius and scale
    orbitItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('hovered');
            
            // Get text content (lowercase to match key)
            const textKey = item.textContent.trim().toLowerCase();
            const data = softSkillsData[textKey];
            if (data && orbitCenter && centerTitle && centerDesc) {
                centerTitle.textContent = data.title;
                centerDesc.textContent = data.desc;
                orbitCenter.classList.add('active-desc');
            }
        });

        item.addEventListener('mouseleave', () => {
            item.classList.remove('hovered');
            
            if (orbitCenter && centerTitle && centerDesc) {
                centerTitle.textContent = 'Soft Skills';
                centerDesc.textContent = '';
                orbitCenter.classList.remove('active-desc');
            }
        });
    });

    orbitContainer.addEventListener('mouseenter', () => {
        isOrbitHovered = true;
    });

    orbitContainer.addEventListener('mouseleave', () => {
        isOrbitHovered = false;
    });

    // Orbit animation loop
    function animateOrbit() {
        if (!isOrbitHovered) {
            rotationAngle += 0.15; // Smooth rotation speed
            if (rotationAngle >= 360) rotationAngle = 0;
        }

        orbitItems.forEach(item => {
            // Get index custom property
            const index = parseFloat(item.style.getPropertyValue('--i')) || 0;
            const baseAngle = index * 45; // 360 / 8 = 45 degrees
            const currentAngle = baseAngle + rotationAngle;
            
            // Adjust radius and scale dynamically if hovered
            const isHovered = item.classList.contains('hovered');
            const radius = isHovered ? 210 : 185;
            const scale = isHovered ? 1.15 : 1.0;

            // Apply transforms: translate out, and then counter-rotate the item text to keep it upright
            item.style.transform = `rotate(${currentAngle}deg) translate(${radius}px) rotate(${-currentAngle}deg) scale(${scale})`;
        });

        requestAnimationFrame(animateOrbit);
    }

    // Initialize initial placements and run loop
    animateOrbit();
}
