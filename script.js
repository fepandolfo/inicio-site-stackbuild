// ===========================
// MOBILE MENU TOGGLE
// ===========================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Close menu when link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.style.display = 'none';
    });
});

// ===========================
// 3D LOGO INTERACTION
// ===========================

const cubes = document.querySelectorAll('.cube');
const wrapper = document.querySelector('.logo-3d-wrapper');

if (wrapper && cubes.length > 0) {
    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        targetRotationY = ((x - centerX) / centerX) * 25;
        targetRotationX = -((y - centerY) / centerY) * 25;
    });

    wrapper.addEventListener('mouseleave', () => {
        targetRotationX = 0;
        targetRotationY = 0;
    });

    function animateCubes() {
        rotationX += (targetRotationX - rotationX) * 0.1;
        rotationY += (targetRotationY - rotationY) * 0.1;

        cubes.forEach((cube, index) => {
            const delay = index * 0.05;
            const delayedRotationX = rotationX + Math.sin(Date.now() * 0.0001 + delay) * 5;
            const delayedRotationY = rotationY + Math.cos(Date.now() * 0.0001 + delay) * 5;
            
            cube.style.transform = `rotateX(${delayedRotationX}deg) rotateY(${delayedRotationY}deg)`;
        });

        requestAnimationFrame(animateCubes);
    }

    animateCubes();
}

// ===========================
// SMOOTH SCROLL & ACTIVE LINK
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===========================
// SCROLL ANIMATIONS
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .service-card, .portfolio-item, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.8)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ===========================
// CTA BUTTONS FUNCTIONALITY
// ===========================

const ctaButtons = document.querySelectorAll('.btn-primary');
ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Create floating text effect
        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        createRipple(x, y);
        
        // Show simple alert (you can replace with modal/form)
        setTimeout(() => {
            alert('Obrigado pelo interesse! Redirecionando para o formulário...');
        }, 300);
    });
});

// Ripple effect
function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'radial-gradient(circle, rgba(0, 212, 255, 0.8), transparent)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    ripple.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(ripple);
    
    let scale = 1;
    const interval = setInterval(() => {
        scale += 0.5;
        ripple.style.transform = `translate(-50%, -50%) scale(${scale})`;
        ripple.style.opacity = 1 - (scale / 3);
        
        if (scale > 3) {
            clearInterval(interval);
            ripple.remove();
        }
    }, 20);
}

// ===========================
// PARALLAX EFFECT
// ===========================

const parallaxElements = document.querySelectorAll('[data-parallax]');

if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const scrollPosition = window.pageYOffset;
            const elementOffset = el.offsetTop;
            
            if (scrollPosition + window.innerHeight > elementOffset) {
                const distance = (scrollPosition + window.innerHeight - elementOffset) * 0.1;
                el.style.transform = `translateY(${distance}px)`;
            }
        });
    });
}

// ===========================
// COUNTER ANIMATION
// ===========================

const metrics = document.querySelectorAll('.metric-number');
const animateCounter = (element) => {
    const target = parseInt(element.textContent);
    const isPercentage = element.textContent.includes('%');
    const isMoney = element.textContent.includes('k');
    
    let current = 0;
    const increment = target / 50;
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(counter);
        }
        
        if (isMoney) {
            element.textContent = Math.floor(current) + 'k';
        } else if (isPercentage) {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
};

// Trigger counter when it comes into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.textContent !== entry.target.dataset.counted) {
            animateCounter(entry.target);
            entry.target.dataset.counted = true;
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

metrics.forEach(metric => {
    counterObserver.observe(metric);
});

// ===========================
// FORM SUBMISSION (placeholder)
// ===========================

const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted');
        alert('Obrigado! Entraremos em contato em breve.');
        form.reset();
    });
});

// ===========================
// KEYBOARD NAVIGATION
// ===========================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.style.display = 'none';
    }
});

// ===========================
// PERFORMANCE MONITORING
// ===========================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time:', pageLoadTime + 'ms');
    });
}

// ===========================
// CURSOR EFFECT (opcional)
// ===========================

let mouse = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Hover effect on buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        btn.style.setProperty('--x', x + 'px');
        btn.style.setProperty('--y', y + 'px');
    });
});

console.log('StackBuild - Transformando presença digital em geração real de clientes');
