// Pricing Page JavaScript - KEDAR Platform
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const faqId = this.dataset.faq;
            const answer = document.getElementById(`faq-${faqId}`);
            
            // Toggle expanded state
            faqItem.classList.toggle('expanded');
            
            // Toggle answer visibility
            if (faqItem.classList.contains('expanded')) {
                answer.style.display = 'block';
            } else {
                answer.style.display = 'none';
            }
        });
    });

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .footer-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Pricing card hover effects
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('premium-card')) {
                this.style.boxShadow = '0 0 40px rgba(212, 168, 83, 0.15)';
            } else {
                this.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });

    // Button click handlers
    const startFreeBtn = document.querySelector('.free-card .card-button');
    const startPremiumBtn = document.querySelector('.premium-card .card-button');
    const contactSalesBtn = document.querySelector('.corporate-card .card-button');
    const ctaButton = document.querySelector('.cta-section .accent-button');

    startFreeBtn?.addEventListener('click', function() {
        handlePlanSelection('Free');
    });

    startPremiumBtn?.addEventListener('click', function() {
        handlePlanSelection('Premium');
    });

    contactSalesBtn?.addEventListener('click', function() {
        handlePlanSelection('Corporate');
    });

    ctaButton?.addEventListener('click', function() {
        handlePlanSelection('Premium Trial');
    });

    // Handle plan selection
    function handlePlanSelection(plan) {
        // Show loading state
        showNotification(`Processing ${plan} selection...`, 'info');
        
        // Simulate processing
        setTimeout(() => {
            switch(plan) {
                case 'Free':
                    showNotification('Redirecting to sign up...', 'success');
                    setTimeout(() => {
                        console.log('Navigate to signup page');
                    }, 1500);
                    break;
                case 'Premium':
                case 'Premium Trial':
                    showNotification('Starting 14-day Premium trial...', 'success');
                    setTimeout(() => {
                        console.log('Navigate to premium signup');
                    }, 1500);
                    break;
                case 'Corporate':
                    showNotification('Opening contact form...', 'success');
                    setTimeout(() => {
                        console.log('Open contact modal or page');
                    }, 1500);
                    break;
            }
        }, 1000);
    }

    // Show notification function
    function showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? 'var(--dosha-kapha)' : type === 'error' ? 'var(--dosha-pitta)' : 'var(--dosha-vata)'};
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 0px;
            font-family: var(--font-mono);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe pricing cards for animation
    pricingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe FAQ items for animation
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
        observer.observe(item);
    });

    // Live counter animation for pricing page
    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = end;
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    }

    // Animate price numbers when they come into view
    const priceAmounts = document.querySelectorAll('.price-amount');
    const priceObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.animated) {
                const text = entry.target.textContent;
                const price = parseInt(text.replace(/[^0-9]/g, ''));
                
                if (price > 0) {
                    animateValue(entry.target, 0, price, 1000);
                    entry.target.animated = true;
                    
                    // Restore original text with formatting
                    setTimeout(() => {
                        entry.target.textContent = text;
                    }, 1000);
                }
            }
        });
    }, { threshold: 0.5 });

    priceAmounts.forEach(amount => {
        priceObserver.observe(amount);
    });

    // Add mobile plan data attributes for responsive table
    if (window.innerWidth <= 768) {
        const planColumns = document.querySelectorAll('.plan-column');
        planColumns.forEach((column, index) => {
            const planNames = ['Free', 'Premium', 'Corporate'];
            column.setAttribute('data-plan', planNames[index]);
        });
    }

    // Handle window resize for responsive table
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            const planColumns = document.querySelectorAll('.plan-column');
            planColumns.forEach((column, index) => {
                const planNames = ['Free', 'Premium', 'Corporate'];
                column.setAttribute('data-plan', planNames[index]);
            });
        }
    });

    console.log('Pricing page initialized successfully');
});

// Pricing-specific utility functions
const Pricing = {
    // Calculate annual savings
    calculateAnnualSavings: (monthlyPrice, annualPrice) => {
        const annualMonthly = monthlyPrice * 12;
        return Math.round(((annualMonthly - annualPrice) / annualMonthly) * 100);
    },
    
    // Get plan features comparison
    comparePlans: (plan1, plan2) => {
        const features = {
            'Burnout Risk Monitoring': { free: 'Basic', premium: 'Advanced', corporate: 'Advanced + Team' },
            'Yoga Pose AI': { free: '3 poses/day', premium: 'Unlimited', corporate: 'Unlimited' },
            'Netra Vision Guard': { free: '2 hours/day', premium: 'Unlimited', corporate: 'Unlimited' },
            'Ayur Assistant': { free: '10 queries/month', premium: 'Unlimited', corporate: 'Unlimited' },
            'Dharma Engine': { free: '—', premium: 'Unlimited', corporate: 'Unlimited' },
            'Data Storage': { free: '30 days', premium: '1 year', corporate: 'Unlimited' },
            'API Access': { free: '—', premium: '—', corporate: 'Custom' }
        };
        
        return features;
    },
    
    // Get recommended plan based on user needs
    getRecommendedPlan: (needs) => {
        const { teamSize, featuresRequired, budget } = needs;
        
        if (teamSize > 50) return 'Corporate';
        if (featuresRequired.includes('Dharma Engine') || featuresRequired.includes('Advanced Analytics')) return 'Premium';
        if (budget < 20) return 'Free';
        return 'Premium';
    }
};
