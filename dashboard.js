// Dashboard JavaScript - KEDAR Platform
document.addEventListener('DOMContentLoaded', function () {
    // Live Time Display
    function updateLiveTime() {
        const now = new Date();
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        const dayName = days[now.getDay()];
        const day = now.getDate();
        const monthName = months[now.getMonth()];
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const timeString = `${dayName} ${day} ${monthName} · ${hours}:${minutes}:${seconds}`;
        document.getElementById('liveTime').textContent = timeString;
    }

    // Update time every second
    setInterval(updateLiveTime, 1000);
    updateLiveTime();

    // Sidebar Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only prevent default and animate if it's a hash link
            if (href.startsWith('#')) {
                e.preventDefault();

                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));

                // Add active class to clicked item
                this.classList.add('active');

                const section = href.substring(1);
                console.log(`Navigating to ${section}`);
            }
            // For actual URLs (.html), let the browser navigate naturally
        });
    });

    // Burnout Gauge Animation
    function animateBurnoutGauge() {
        const gauge = document.querySelector('.burnout-gauge circle:last-child');
        const score = document.querySelector('.burnout-score');
        const targetScore = 72;
        const circumference = 2 * Math.PI * 25; // radius = 25
        const targetOffset = circumference - (targetScore / 100) * circumference;

        let currentScore = 0;
        let currentOffset = circumference;

        const animationDuration = 2000; // 2 seconds
        const steps = 60;
        const stepDuration = animationDuration / steps;
        const scoreIncrement = targetScore / steps;
        const offsetDecrement = (circumference - targetOffset) / steps;

        let step = 0;
        const animation = setInterval(() => {
            step++;
            currentScore += scoreIncrement;
            currentOffset -= offsetDecrement;

            score.textContent = Math.round(currentScore);
            gauge.style.strokeDashoffset = currentOffset;

            if (step >= steps) {
                clearInterval(animation);
                score.textContent = targetScore;
                gauge.style.strokeDashoffset = targetOffset;
            }
        }, stepDuration);
    }

    // Start gauge animation when page loads
    setTimeout(animateBurnoutGauge, 500);

    // KPI Trend Animations
    function animateKPIValues() {
        const kpiValues = document.querySelectorAll('.kpi-value');
        kpiValues.forEach((kpi, index) => {
            const text = kpi.textContent;
            const numericValue = parseInt(text) || 0;

            if (numericValue > 0) {
                let currentValue = 0;
                const increment = numericValue / 30;
                const delay = index * 100;

                setTimeout(() => {
                    const animation = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= numericValue) {
                            currentValue = numericValue;
                            clearInterval(animation);
                        }

                        // Preserve any non-numeric parts (like "Vata" or "45m")
                        const nonNumeric = text.replace(/[0-9]/g, '');
                        kpi.innerHTML = Math.round(currentValue) + nonNumeric + kpi.innerHTML.substring(kpi.innerHTML.indexOf('<'));
                    }, 50);
                }, delay);
            }
        });
    }

    setTimeout(animateKPIValues, 1000);

    // Query Input Functionality
    const queryInput = document.querySelector('.query-input');
    const querySubmit = document.querySelector('.query-submit');
    const queryResponse = document.querySelector('.query-response');
    const queryPills = document.querySelectorAll('.query-pill');

    function submitQuery(query) {
        if (!query.trim()) return;

        // Show loading state
        querySubmit.textContent = '...';
        querySubmit.disabled = true;

        // Simulate AI response delay
        setTimeout(() => {
            // Show response
            queryResponse.style.display = 'block';

            // Update response content based on query
            const responseContent = document.querySelector('.response-content');
            const responses = {
                'sleep': 'Based on your Vata dosha and current sleep patterns, I recommend going to bed by 10 PM and waking by 6 AM. This aligns with your natural circadian rhythm.',
                'screen': 'Your screen time is 40% above optimal levels. Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.',
                'yoga': 'For Vata imbalance, focus on grounding poses like Mountain Pose, Child\'s Pose, and gentle forward folds. Avoid fast-paced vinyasa.',
                'meditation': 'Start with 5 minutes of alternate nostril breathing (Nadi Shodhana) to balance your nervous system before meditation.'
            };

            let response = responses['default'];
            for (const [key, value] of Object.entries(responses)) {
                if (query.toLowerCase().includes(key)) {
                    response = value;
                    break;
                }
            }

            responseContent.textContent = response;

            // Reset submit button
            querySubmit.textContent = '→';
            querySubmit.disabled = false;

            // Clear input
            queryInput.value = '';

            // Scroll to response
            queryResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1500);
    }

    querySubmit.addEventListener('click', () => submitQuery(queryInput.value));

    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitQuery(queryInput.value);
        }
    });

    queryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            queryInput.value = pill.textContent;
            submitQuery(pill.textContent);
        });
    });

    // Task Checkbox Interactions
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const timeBlock = this.closest('.time-block');
            if (this.checked) {
                timeBlock.style.opacity = '0.7';
                // Here you would typically update the backend
                console.log(`Task completed: ${timeBlock.querySelector('.task-name').textContent}`);
            } else {
                timeBlock.style.opacity = '1';
            }
        });
    });

    // Module Quick Access Cards
    const moduleCards = document.querySelectorAll('.module-quick-card');
    moduleCards.forEach(card => {
        card.addEventListener('click', function () {
            const moduleName = this.querySelector('.module-name').textContent;
            console.log(`Opening module: ${moduleName}`);
            // Here you would typically navigate to the module page
        });
    });

    // Chart.js Integration for Burnout Chart
    function createBurnoutChart() {
        const canvas = document.getElementById('burnoutChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Simple chart drawing (in production, use Chart.js or similar)
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set styles
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.font = '10px DM Mono';
        ctx.fillStyle = '#888';

        // Draw grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - 2 * padding) * i / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            // Y-axis labels
            ctx.fillText((100 - i * 20).toString(), 10, y + 3);
        }

        // Draw data line
        const data = [45, 52, 48, 65, 72, 68, 72]; // 7 days of data
        const stepX = (width - 2 * padding) / (data.length - 1);

        ctx.strokeStyle = '#d4a853';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((value, index) => {
            const x = padding + index * stepX;
            const y = padding + (height - 2 * padding) * (1 - value / 100);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw data points
        ctx.fillStyle = '#d4a853';
        data.forEach((value, index) => {
            const x = padding + index * stepX;
            const y = padding + (height - 2 * padding) * (1 - value / 100);

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });

        // X-axis labels
        ctx.fillStyle = '#888';
        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        days.forEach((day, index) => {
            const x = padding + index * stepX;
            ctx.fillText(day, x - 15, height - 10);
        });
    }

    // Create chart after a short delay
    setTimeout(createBurnoutChart, 1500);

    // Resize chart on window resize
    window.addEventListener('resize', () => {
        setTimeout(createBurnoutChart, 100);
    });

    // Mobile Menu Toggle
    function createMobileMenuToggle() {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');

            // Create mobile menu button if it doesn't exist
            if (!document.querySelector('.mobile-menu-btn')) {
                const menuBtn = document.createElement('button');
                menuBtn.className = 'mobile-menu-btn';
                menuBtn.innerHTML = '☰';
                menuBtn.style.cssText = `
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

                menuBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('open');
                });

                document.body.appendChild(menuBtn);
            }
        } else {
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (menuBtn) {
                menuBtn.remove();
            }
            document.querySelector('.sidebar').classList.remove('open');
        }
    }

    createMobileMenuToggle();
    window.addEventListener('resize', createMobileMenuToggle);

    // Notification Bell Animation
    const notificationBell = document.querySelector('.notification-bell');
    let notificationCount = 3;

    notificationBell.addEventListener('click', () => {
        if (notificationCount > 0) {
            notificationBell.style.animation = 'ring 0.5s ease-in-out';
            setTimeout(() => {
                notificationBell.style.animation = '';
                notificationCount = 0;
            }, 500);
        }
    });

    // Add CSS for notification animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ring {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
        }
    `;
    document.head.appendChild(style);

    console.log('KEDAR Dashboard initialized successfully');
});

// Dashboard utility functions
const Dashboard = {
    // Calculate and update burnout risk
    updateBurnoutRisk: () => {
        const metrics = {
            sleepHours: 6.5,
            screenTime: 11.2,
            stressLevel: 7,
            exerciseMinutes: 20
        };

        return KEDAR.calculateBurnoutRisk(metrics);
    },

    // Get current dosha recommendation
    getCurrentRecommendation: () => {
        const hour = new Date().getHours();
        let timeOfDay = 'morning';

        if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17) timeOfDay = 'evening';

        return KEDAR.getDoshaRecommendation('vata', timeOfDay);
    },

    // Format metric for display
    formatMetric: (value, unit) => {
        return `${value}${unit}`;
    }
};
