/* ============================================
   ANGLIN LAW - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initHeader();
    initMobileNav();
    initScrollReveal();
    initCounterAnimation();
    initContactForm();
    initSmoothScroll();
});

/* ============================================
   Header Scroll Effect
   ============================================ */

function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ============================================
   Mobile Navigation
   ============================================ */

function initMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Close nav when clicking a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });

    // Close nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
}

/* ============================================
   Scroll Reveal Animation
   ============================================ */

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Stagger children animations if present
                const children = entry.target.querySelectorAll('.reveal-child');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('active');
                });

                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

/* ============================================
   Counter Animation
   ============================================ */

function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    // On mobile, just show static numbers without animation
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            counter.textContent = target.toLocaleString();
        });
        return;
    }

    const counterOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, counterOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    updateCounter();
}

/* ============================================
   Contact Form Handling
   ============================================ */

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Gather form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission (replace with actual endpoint)
        try {
            // In production, replace with actual form handling
            // await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showFormMessage(form, 'success', 'Thank you for your message. We will be in touch shortly.');
            form.reset();

        } catch (error) {
            // Show error message
            showFormMessage(form, 'error', 'There was an error sending your message. Please try again or call us directly.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showFormMessage(form, type, message) {
    // Remove existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        ${type === 'success'
            ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
            : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
    `;

    form.insertBefore(messageEl, form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

/* ============================================
   Smooth Scroll
   ============================================ */

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function for performance
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   Page-Specific Initializations
   ============================================ */

// Practice Areas page - smooth scroll to sections
function initPracticeAreasPage() {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

// Check if we're on the practice areas page
if (window.location.pathname.includes('practice-areas')) {
    document.addEventListener('DOMContentLoaded', initPracticeAreasPage);
}
