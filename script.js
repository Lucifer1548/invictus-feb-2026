// KEDAR - Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .footer-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else if (href.endsWith('.html')) {
                // Allow external page navigation
                window.location.href = href;
            }
        });
    });

    // Demo functionality
    window.showDemo = function() {
        // Create demo modal
        const modal = document.createElement('div');
        modal.className = 'demo-modal';
        modal.innerHTML = `
            <div class="demo-overlay">
                <div class="demo-content">
                    <div class="demo-header">
                        <h3>KEDAR Platform Demo</h3>
                        <button class="demo-close" onclick="closeDemo()">×</button>
                    </div>
                    <div class="demo-body">
                        <p>Experience the full KEDAR wellness ecosystem with:</p>
                        <ul>
                            <li>🧠 Real-time burnout prediction</li>
                            <li>🧘 AI-powered yoga pose detection</li>
                            <li>👁️ Vision guard monitoring</li>
                            <li>🌿 Ayurvedic guidance</li>
                            <li>☯️ Ethical decision support</li>
                        </ul>
                        <div class="demo-buttons">
                            <button class="ghost-button" onclick="closeDemo()">Close</button>
                            <button class="accent-button" onclick="window.location.href='onboarding.html'">Try Now</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .demo-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .demo-overlay {
                background: rgba(10, 10, 10, 0.9);
                backdrop-filter: blur(10px);
                padding: 2rem;
                border-radius: 0px;
                max-width: 500px;
                width: 90%;
            }
            .demo-content {
                background: var(--bg-secondary);
                border: 1px solid var(--border-subtle);
                padding: 2rem;
                color: var(--text-primary);
            }
            .demo-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            .demo-header h3 {
                font-family: var(--font-body);
                font-size: 1.5rem;
                font-weight: 500;
                color: var(--text-primary);
            }
            .demo-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .demo-body p {
                margin-bottom: 1rem;
                color: var(--text-secondary);
            }
            .demo-body ul {
                list-style: none;
                padding: 0;
                margin-bottom: 1.5rem;
            }
            .demo-body li {
                padding: 0.5rem 0;
                color: var(--text-secondary);
            }
            .demo-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
        
        // Auto-close on overlay click
        modal.querySelector('.demo-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeDemo();
            }
        });
    };

    // Close demo modal
    window.closeDemo = function() {
        const modal = document.querySelector('.demo-modal');
        if (modal) {
            modal.remove();
        }
    };

    // Live counter animation
    let sessionCount = 0;
    const liveCounter = document.querySelector('.live-counter');
    
    function updateSessionCount() {
        // Simulate varying session count
        const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and 2
        sessionCount = Math.max(0, sessionCount + change);
        if (liveCounter) {
            liveCounter.textContent = `${sessionCount} sessions active`;
        }
    }
    
    // Update counter every 3 seconds
    setInterval(updateSessionCount, 3000);
    updateSessionCount(); // Initial update

    // Module card hover effects
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        // Make module cards clickable
        card.addEventListener('click', function() {
            const moduleName = this.querySelector('.module-name').textContent;
            const modulePages = {
                'Chitta': 'dashboard.html',
                'Dinacharya Planner': 'dashboard.html',
                'Yoga Posture AI': 'yoga.html',
                'Netra': 'netra.html',
                'Dharma Engine': 'dharma.html',
                'Ayur Assistant': 'ayur.html'
            };
            
            const targetPage = modulePages[moduleName];
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });

    // Intersection Observer for scroll animations
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

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.problem-column, .module-card, .philosophy-quote, .metric-column');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
        observer.observe(el);
    });

    // Button interactions
    const buttons = document.querySelectorAll('.ghost-button, .accent-button, .text-link-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Parallax effect for hero section
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const speed = 0.5;
            hero.style.transform = `translateY(${scrolled * speed}px)`;
        }
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);

    // Mobile menu toggle
    function createMobileMenuToggle() {
        if (window.innerWidth <= 768) {
            const navbar = document.querySelector('.navbar');
            const navCenter = document.querySelector('.nav-center');
            
            if (!document.querySelector('.mobile-menu-toggle')) {
                const toggle = document.createElement('button');
                toggle.className = 'mobile-menu-btn';
                toggle.innerHTML = '☰';
                toggle.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    z-index: 1001;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-subtle);
                    color: var(--text-primary);
                    padding: 10px;
                    font-size: 18px;
                    cursor: pointer;
                    border-radius: 0px;
                `;
                
                toggle.addEventListener('click', () => {
                    navCenter.style.display = navCenter.style.display === 'flex' ? 'none' : 'flex';
                    navCenter.style.position = 'absolute';
                    navCenter.style.top = '60px';
                    navCenter.style.left = '0';
                    navCenter.style.right = '0';
                    navCenter.style.background = 'var(--bg-primary)';
                    navCenter.style.flexDirection = 'column';
                    navCenter.style.padding = '20px';
                    navCenter.style.borderTop = '1px solid var(--border-subtle)';
                });
                
                navbar.appendChild(toggle);
            }
        } else {
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (menuBtn) {
                menuBtn.remove();
            }
            document.querySelector('.nav-center').style.display = 'flex';
        }
    }

    createMobileMenuToggle();
    window.addEventListener('resize', createMobileMenuToggle);

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .mobile-menu-toggle {
            display: none;
        }
        
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block !important;
            }
        }
    `;
            document.head.appendChild(style);

    console.log('KEDAR platform initialized successfully');
});

// Utility functions for future features
const KEDAR = {
    // Format time for display
    formatTime: (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    },
    
    // Calculate burnout risk (mock implementation)
    calculateBurnoutRisk: (metrics) => {
        // This would integrate with actual ML model in production
        const { sleepHours, screenTime, stressLevel, exerciseMinutes } = metrics;
        
        let risk = 0;
        
        // Sleep factor (less than 7 hours increases risk)
        if (sleepHours < 7) risk += (7 - sleepHours) * 10;
        
        // Screen time factor (more than 8 hours increases risk)
        if (screenTime > 8) risk += (screenTime - 8) * 5;
        
        // Stress level factor (1-10 scale)
        risk += stressLevel * 5;
        
        // Exercise factor (less than 30 minutes increases risk)
        if (exerciseMinutes < 30) risk += (30 - exerciseMinutes) * 0.5;
        
        return Math.min(100, Math.round(risk));
    },
    
    // Get dosha recommendation (mock implementation)
    getDoshaRecommendation: (dosha, timeOfDay) => {
        const recommendations = {
            vata: {
                morning: 'Warm lemon water and gentle stretching',
                afternoon: 'Grounding activities and warm meals',
                evening: 'Calming meditation and early bedtime'
            },
            pitta: {
                morning: 'Cooling breathing exercises',
                afternoon: 'Moderate exercise and avoid overheating',
                evening: 'Relaxing activities and avoid spicy food'
            },
            kapha: {
                morning: 'Vigorous exercise and stimulating activities',
                afternoon: 'Light meals and avoid heavy foods',
                evening: 'Creative pursuits and avoid oversleeping'
            }
        };
        
        return recommendations[dosha]?.[timeOfDay] || 'Follow your natural rhythm';
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KEDAR;
}
