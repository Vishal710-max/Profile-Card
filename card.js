// ==== INITIALIZATION ====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }, 500);

    // Initialize all features
    initializeContactForm();
    initializeAnimations();
    initializeCounters();
    initializeSkillBars();
    initializeFormValidation();
    initializeKeyboardNavigation();
}

// ==== CONTACT FORM FUNCTIONALITY ====
function initializeContactForm() {
    const contactBtn = document.getElementById('contactBtn');
    const contactForm = document.getElementById('contactForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.getElementById('closeBtn');
    const messageForm = document.getElementById('messageForm');

    if (contactBtn && contactForm) {
        // Open contact form
        contactBtn.addEventListener('click', () => {
            openContactForm();
        });

        // Close buttons
        [cancelBtn, closeBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    closeContactForm();
                });
            }
        });

        // Close on outside click
        contactForm.addEventListener('click', (e) => {
            if (e.target === contactForm) {
                closeContactForm();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactForm.classList.contains('active')) {
                closeContactForm();
            }
        });
    }

    // Form submission
    if (messageForm) {
        messageForm.addEventListener('submit', handleFormSubmit);
    }
}

function openContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.classList.add('active');
        contactForm.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = contactForm.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const messageForm = document.getElementById('messageForm');
    
    if (contactForm) {
        contactForm.classList.remove('active');
        contactForm.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    if (messageForm) {
        messageForm.reset();
        clearErrors();
    }
}

// ==== FORM VALIDATION ====
function initializeFormValidation() {
    const inputs = document.querySelectorAll('#messageForm input, #messageForm textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const fieldName = field.getAttribute('name');
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearFieldError(field);

    // Validation rules
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Name should contain only letters';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'subject':
            if (value.length < 3) {
                isValid = false;
                errorMessage = 'Subject must be at least 3 characters';
            }
            break;

        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.style.borderColor = '#e74c3c';
    
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('active');
    }
}

function clearErrors() {
    const inputs = document.querySelectorAll('#messageForm input, #messageForm textarea');
    inputs.forEach(input => clearFieldError(input));
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;

    // Validate all fields
    inputs.forEach(input => {
        if (input.hasAttribute('required')) {
            const isValid = validateField(input);
            if (!isValid) {
                isFormValid = false;
            }
        }
    });

    if (!isFormValid) {
        // Show error notification
        showNotification('Please fix the errors in the form', 'error');
        return;
    }

    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Simulate sending (in real app, send to backend)
    submitFormData(formData);
}

function submitFormData(data) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    emailjs.send(
        "service_j0krv5e",
        "template_vf8nvef",
        {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            time: new Date().toLocaleString()
        },
        "0644IYHGUt6ZTMMJW"
    ).then(() => {
        showNotification(
            `Thanks, ${data.name}! Your message about "${data.subject}" has been sent. We'll reach out at ${data.email}.`,
            'success'
        );

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        setTimeout(() => {
            closeContactForm();
        }, 1500);

    }).catch((error) => {
        console.error("EmailJS Error:", error);

        showNotification(
            "Failed to send message. Please try again later.",
            "error"
        );

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}


// ==== NOTIFICATION SYSTEM ====
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        background: type === 'success' ? '#2ecc71' : '#e74c3c',
        color: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '15px',
        fontWeight: '500',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '400px'
    });

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add notification animations to page
if (!document.querySelector('#notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
}

// ==== COUNTER ANIMATION ====
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const options = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, options);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
}

// ==== SKILL BARS ANIMATION ====
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const options = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                entry.target.classList.add('animated');
            }
        });
    }, options);

    skillBars.forEach(bar => observer.observe(bar));
}

// ==== SCROLL ANIMATIONS ====
function initializeAnimations() {
    const elements = document.querySelectorAll('.skill, .highlight-item, .social-link');
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, options);

    elements.forEach((element, index) => {
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// ==== KEYBOARD NAVIGATION ====
function initializeKeyboardNavigation() {
    // Tab trap for modal
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && contactForm.classList.contains('active')) {
                const focusableElements = contactForm.querySelectorAll(
                    'input, textarea, button, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// ==== SMOOTH SCROLL ====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==== THEME DETECTION ====
function detectTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('User prefers dark mode:', prefersDark);
}

detectTheme();

// ==== COPY EMAIL ====
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy email', 'error');
    });
}

// Add copy functionality to email link
const emailLink = document.querySelector('.email-display a');
if (emailLink) {
    const email = emailLink.textContent;
    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        copyEmail(email);
    });
}

// ==== PERFORMANCE MONITORING ====
window.addEventListener('load', () => {
    // Log performance metrics
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page loaded in ${pageLoadTime}ms`);
});

// ==== UTILITY FUNCTIONS ====

// Debounce function for performance
function debounce(func, wait) {
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
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==== EASTER EGG ====
let clickCount = 0;
const profileImage = document.querySelector('.profile-image');

if (profileImage) {
    profileImage.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            showNotification('🎉 You found the easter egg! You\'re awesome!', 'success');
            profileImage.style.animation = 'spin 1s ease';
            setTimeout(() => {
                profileImage.style.animation = '';
                clickCount = 0;
            }, 1000);
        }
    });
}

// ==== CONSOLE MESSAGE ====
console.log('%c👋 Hello Developer!', 'font-size: 20px; font-weight: bold; color: #2ecc71;');
console.log('%cInterested in the code? Check out my GitHub!', 'font-size: 14px; color: #ccc;');
console.log('%chttps://github.com/Vishal710-max', 'font-size: 14px; color: #2ecc71;');

// ==== SERVICE WORKER (Optional - for PWA) ====
if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js').then(() => {
    //     console.log('Service Worker registered');
    // });
}

// ==== EXPORT FUNCTIONS (for testing) ====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        handleFormSubmit,
        showNotification,
        animateCounter
    };
}
