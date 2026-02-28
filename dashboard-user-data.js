// Dashboard User Data Integration
document.addEventListener('DOMContentLoaded', function() {
    // Load user data from onboarding
    function loadUserData() {
        const userData = localStorage.getItem('kedar_user_data');
        if (userData) {
            const user = JSON.parse(userData);
            console.log('Loaded user data:', user);
            
            // Update dashboard with user data
            updateDashboardWithUserData(user);
            return user;
        }
        return null;
    }

    // Update dashboard elements with user data
    function updateDashboardWithUserData(user) {
        // Update user name in dashboard
        const userAvatar = document.querySelector('.user-avatar img');
        if (userAvatar && user.name) {
            userAvatar.alt = user.name;
            // Update avatar with initials
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23d4a853'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='%230a0a0a' font-family='monospace' font-size='14' font-weight='bold'%3E${initials}%3C/text%3E%3C/svg%3E`;
        }

        // Update schedule based on user preferences
        if (user.schedule) {
            updateDinacharyaSchedule(user.schedule);
        }

        // Update preferences
        if (user.preferences) {
            updateDashboardPreferences(user.preferences);
        }

        // Show personalized welcome message
        showWelcomeMessage(user);
    }

    // Update Dinacharya schedule
    function updateDinacharyaSchedule(schedule) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        // Map user schedule to timeline
        const scheduleMap = {
            wakeTime: { time: schedule.wakeTime, activity: 'Wake Up' },
            workStart: { time: schedule.workStart, activity: 'Work Begins' },
            workEnd: { time: schedule.workEnd, activity: 'Work Ends' },
            sleepTime: { time: schedule.sleepTime, activity: 'Bedtime' }
        };

        // Update timeline items
        Object.entries(scheduleMap).forEach(([key, value], index) => {
            if (timelineItems[index]) {
                const timeEl = timelineItems[index].querySelector('.timeline-time');
                const activityEl = timelineItems[index].querySelector('.timeline-activity');
                
                if (timeEl) timeEl.textContent = value.time;
                if (activityEl) activityEl.textContent = value.activity;
            }
        });
    }

    // Update dashboard preferences
    function updateDashboardPreferences(preferences) {
        // Show/hide preference-based elements
        if (preferences.morningMeditation) {
            showMeditationReminder();
        }
        
        if (preferences.yogaBreak) {
            enableYogaBreaks();
        }
        
        if (preferences.eyeExercises) {
            enableEyeExercises();
        }
        
        if (preferences.eveningWindDown) {
            showEveningRoutine();
        }
    }

    // Show welcome message
    function showWelcomeMessage(user) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-message';
        welcomeDiv.innerHTML = `
            <h3>Welcome back, ${user.name}! 👋</h3>
            <p>Your ${user.dosha ? user.dosha.toUpperCase() : 'personalized'} wellness journey continues</p>
            <p>Today's focus: ${getTodayFocus(user.goals)}</p>
        `;
        
        // Insert into dashboard header
        const headerContent = document.querySelector('.dashboard-header .header-left');
        if (headerContent) {
            headerContent.insertBefore(welcomeDiv, headerContent.firstChild);
        }
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .welcome-message {
                background: rgba(212, 168, 83, 0.1);
                border-left: 3px solid var(--accent-saffron);
                padding: 1rem;
                margin-bottom: 1rem;
                border-radius: 0px;
            }
            
            .welcome-message h3 {
                font-family: var(--font-body);
                font-size: 16px;
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }
            
            .welcome-message p {
                font-family: var(--font-body);
                font-size: 12px;
                color: var(--text-secondary);
                margin: 0.25rem 0;
            }
        `;
        document.head.appendChild(style);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            welcomeDiv.style.opacity = '0';
            welcomeDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => welcomeDiv.remove(), 300);
        }, 5000);
    }

    // Get today's focus based on user goals
    function getTodayFocus(goals) {
        const focusMap = {
            stress: 'stress management',
            sleep: 'sleep hygiene',
            focus: 'concentration exercises',
            posture: 'posture correction',
            energy: 'energy boosting',
            balance: 'work-life balance'
        };
        
        if (goals && goals.length > 0) {
            return focusMap[goals[0]] || 'wellness routine';
        }
        return 'wellness routine';
    }

    // Helper functions for preferences
    function showMeditationReminder() {
        console.log('Meditation reminders enabled');
        // Add meditation reminder logic
    }

    function enableYogaBreaks() {
        console.log('Yoga breaks enabled');
        // Add yoga break logic
    }

    function enableEyeExercises() {
        console.log('Eye exercises enabled');
        // Add eye exercise logic
    }

    function showEveningRoutine() {
        console.log('Evening routine enabled');
        // Add evening routine logic
    }

    // Load user data on page load
    const userData = loadUserData();
    
    // If no user data, redirect to onboarding
    if (!userData) {
        console.log('No user data found, redirecting to onboarding...');
        setTimeout(() => {
            window.location.href = 'onboarding.html';
        }, 1000);
    }

    console.log('Dashboard user data integration loaded');
});
