// Enhanced Onboarding Flow JavaScript - KEDAR Platform
document.addEventListener('DOMContentLoaded', function() {
    // Onboarding state
    let currentStep = 1;
    const totalSteps = 4;
    
    // User data collection
    let userData = {
        name: '',
        goals: [],
        doshaAnswers: {},
        schedule: {
            wakeTime: '06:00',
            sleepTime: '22:00',
            workStart: '09:00',
            workEnd: '17:00'
        },
        preferences: {
            morningMeditation: true,
            yogaBreak: true,
            eyeExercises: true,
            eveningWindDown: true
        },
        permissions: {
            camera: false,
            calendar: false,
            notifications: false
        }
    };

    // DOM elements
    const progressFill = document.getElementById('progressFill');
    const stepElements = document.querySelectorAll('.onboarding-step');
    const progressSteps = document.querySelectorAll('.step');

    // Navigation buttons
    const step1Next = document.getElementById('step1Next');
    const step2Back = document.getElementById('step2Back');
    const step2Next = document.getElementById('step2Next');
    const step3Back = document.getElementById('step3Back');
    const step3Next = document.getElementById('step3Next');
    const step4Back = document.getElementById('step4Back');
    const completeOnboarding = document.getElementById('completeOnboarding');

    // Initialize event listeners
    initializeEventListeners();

    function initializeEventListeners() {
        // Step 1: Name and Goals
        document.getElementById('userName').addEventListener('input', function() {
            userData.name = this.value;
            validateStep1();
        });

        // Goal cards
        document.querySelectorAll('.goal-card').forEach(card => {
            card.addEventListener('click', function() {
                const goal = this.dataset.goal;
                this.classList.toggle('selected');
                
                if (this.classList.contains('selected')) {
                    if (!userData.goals.includes(goal)) {
                        userData.goals.push(goal);
                    }
                } else {
                    userData.goals = userData.goals.filter(g => g !== goal);
                }
                
                validateStep1();
            });
        });

        // Step 2: Dosha Quiz
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', function() {
                const question = this.closest('.question-card').dataset.question;
                const option = this.dataset.option;
                
                // Remove selection from siblings
                this.parentElement.querySelectorAll('.option-card').forEach(sibling => {
                    sibling.classList.remove('selected');
                });
                
                // Add selection to clicked option
                this.classList.add('selected');
                
                // Store answer
                userData.doshaAnswers[question] = option;
                
                // Enable next button
                document.getElementById('step2Next').disabled = false;
            });
        });

        // Step 3: Schedule with enhanced handling
        ['wakeTime', 'sleepTime', 'workStart', 'workEnd'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', function() {
                    userData.schedule[id] = this.value;
                    console.log('Updated', id, ':', this.value);
                    
                    // Visual feedback
                    this.style.borderColor = 'var(--accent-saffron)';
                    setTimeout(() => {
                        this.style.borderColor = 'var(--border-active)';
                    }, 300);
                });
            }
        });

        // Preference toggles with enhanced functionality
        ['morningMeditation', 'yogaBreak', 'eyeExercises', 'eveningWindDown'].forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    userData.preferences[id] = this.checked;
                    console.log('Updated preference', id, ':', this.checked);
                    
                    // Enhanced visual feedback
                    const toggleSlider = this.nextElementSibling;
                    const preferenceCard = this.closest('.preference-card');
                    
                    if (toggleSlider) {
                        toggleSlider.style.backgroundColor = this.checked ? 'var(--accent-saffron)' : 'var(--border-active)';
                        toggleSlider.style.transform = this.checked ? 'scale(1.1)' : 'scale(1)';
                        
                        setTimeout(() => {
                            toggleSlider.style.transform = 'scale(1)';
                        }, 200);
                    }
                    
                    if (preferenceCard) {
                        preferenceCard.style.borderColor = this.checked ? 'var(--accent-saffron)' : 'var(--border-subtle)';
                        preferenceCard.style.background = this.checked ? 'rgba(212, 168, 83, 0.1)' : 'var(--bg-secondary)';
                    }
                });
                
                // Initialize toggle state
                const toggleSlider = checkbox.nextElementSibling;
                const preferenceCard = checkbox.closest('.preference-card');
                
                if (toggleSlider) {
                    toggleSlider.style.backgroundColor = checkbox.checked ? 'var(--accent-saffron)' : 'var(--border-active)';
                }
                
                if (preferenceCard && checkbox.checked) {
                    preferenceCard.style.borderColor = 'var(--accent-saffron)';
                    preferenceCard.style.background = 'rgba(212, 168, 83, 0.1)';
                }
            }
        });

        // Step 4: Permissions with enhanced handling
        ['cameraPermission', 'calendarPermission', 'notificationPermission'].forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    const permission = id.replace('Permission', '');
                    userData.permissions[permission] = this.checked;
                    console.log('Updated permission', permission, ':', this.checked);
                    
                    // Enhanced visual feedback
                    const toggleSlider = this.nextElementSibling;
                    const permissionCard = this.closest('.permission-card');
                    
                    if (toggleSlider) {
                        toggleSlider.style.backgroundColor = this.checked ? 'var(--accent-saffron)' : 'var(--border-active)';
                        toggleSlider.style.transform = this.checked ? 'scale(1.1)' : 'scale(1)';
                        
                        setTimeout(() => {
                            toggleSlider.style.transform = 'scale(1)';
                        }, 200);
                    }
                    
                    if (permissionCard) {
                        permissionCard.classList.toggle('active', this.checked);
                        
                        // Add ripple effect
                        if (this.checked) {
                            createRippleEffect(permissionCard);
                        }
                    }
                });
                
                // Initialize toggle state
                const toggleSlider = checkbox.nextElementSibling;
                const permissionCard = checkbox.closest('.permission-card');
                
                if (toggleSlider) {
                    toggleSlider.style.backgroundColor = checkbox.checked ? 'var(--accent-saffron)' : 'var(--border-active)';
                }
                
                if (permissionCard && checkbox.checked) {
                    permissionCard.classList.add('active');
                }
            }
        });

        // Navigation buttons
        step1Next.addEventListener('click', () => goToStep(2));
        step2Back.addEventListener('click', () => goToStep(1));
        step2Next.addEventListener('click', () => goToStep(3));
        step3Back.addEventListener('click', () => goToStep(2));
        step3Next.addEventListener('click', () => goToStep(4));
        step4Back.addEventListener('click', () => goToStep(3));
        completeOnboarding.addEventListener('click', completeOnboardingProcess);
    }

    // Create ripple effect
    function createRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(212, 168, 83, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    function validateStep1() {
        const nameValid = userData.name.trim().length > 0;
        const goalsValid = userData.goals.length > 0;
        step1Next.disabled = !(nameValid && goalsValid);
    }

    function goToStep(step) {
        // Update current step
        currentStep = step;
        
        // Update progress bar
        const progressPercentage = (step / totalSteps) * 100;
        progressFill.style.width = progressPercentage + '%';
        
        // Update step indicators
        progressSteps.forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            if (index + 1 < step) {
                stepEl.classList.add('completed');
            } else if (index + 1 === step) {
                stepEl.classList.add('active');
            }
        });
        
        // Show/hide step content
        stepElements.forEach((stepEl, index) => {
            stepEl.classList.remove('active');
            if (index + 1 === step) {
                stepEl.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Special handling for quiz step
        if (step === 2) {
            initializeQuiz();
        }
        
        // Special handling for permissions step
        if (step === 4) {
            initializePermissions();
        }
    }

    // Initialize quiz with all 10 questions
    function initializeQuiz() {
        let currentQuestion = 1;
        const totalQuestions = 10;
        
        function showQuestion(questionNum) {
            // Hide all questions
            document.querySelectorAll('.question-card').forEach(q => {
                q.classList.remove('active');
            });
            
            // Show current question
            const currentQuestionEl = document.querySelector(`[data-question="${questionNum}"]`);
            if (currentQuestionEl) {
                currentQuestionEl.classList.add('active');
            }
            
            // Update progress
            const progressPercentage = (questionNum / totalQuestions) * 100;
            document.getElementById('quizProgress').style.width = progressPercentage + '%';
            document.querySelector('.quiz-progress-text').textContent = `Question ${questionNum} of ${totalQuestions}`;
            
            // Check if this question has been answered
            const answered = userData.doshaAnswers[questionNum];
            document.getElementById('step2Next').disabled = !answered;
            
            // Auto-advance after selection
            const optionCards = currentQuestionEl.querySelectorAll('.option-card');
            optionCards.forEach(card => {
                card.addEventListener('click', function() {
                    const question = parseInt(this.closest('.question-card').dataset.question);
                    const option = this.dataset.option;
                    
                    // Store answer
                    userData.doshaAnswers[question] = option;
                    
                    // Visual feedback
                    optionCards.forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Auto-advance after short delay
                    setTimeout(() => {
                        if (question < totalQuestions) {
                            currentQuestion++;
                            showQuestion(currentQuestion);
                        } else {
                            // Quiz completed
                            document.getElementById('step2Next').disabled = false;
                            document.getElementById('step2Next').textContent = 'Complete Quiz →';
                            
                            // Show dosha results
                            showDoshaResults();
                        }
                    }, 300);
                });
            });
        }
        
        // Show first question
        showQuestion(1);
    }

    // Initialize permissions step
    function initializePermissions() {
        console.log('Initializing permissions step...');
        
        // Check if permissions are available in browser
        if ('Notification' in window) {
            console.log('Notification API available');
        } else {
            console.log('Notification API not available');
        }
        
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            console.log('Camera API available');
        } else {
            console.log('Camera API not available');
        }
        
        // Add click handlers to permission cards for better UX
        document.querySelectorAll('.permission-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on the toggle
                if (!e.target.closest('.permission-toggle')) {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                }
            });
        });
    }

    // Show dosha results
    function showDoshaResults() {
        const doshaColors = {
            vata: '#8ab4d4',
            pitta: '#d47a53', 
            kapha: '#7ab87a'
        };
        const doshaDescriptions = {
            vata: 'Creative, adaptable, energetic',
            pitta: 'Intense, focused, driven',
            kapha: 'Calm, stable, grounded'
        };
        
        // Calculate dosha
        const doshaResult = calculateDosha(userData.doshaAnswers);
        
        // Create dosha result display
        const doshaResultDiv = document.createElement('div');
        doshaResultDiv.className = 'dosha-result';
        doshaResultDiv.innerHTML = `
            <h4>Your Dosha Constitution: <span class="dosha-type" style="color: ${doshaColors[doshaResult]}">${doshaResult.toUpperCase()}</span></h4>
            <p>${doshaDescriptions[doshaResult]}</p>
            <div class="dosha-traits">
                <div class="trait vata ${userData.doshaAnswers['1'] === 'vata' ? 'active' : ''}">Creative & Imaginative</div>
                <div class="trait pitta ${userData.doshaAnswers['2'] === 'pitta' ? 'active' : ''}">Focused & Driven</div>
                <div class="trait kapha ${userData.doshaAnswers['3'] === 'kapha' ? 'active' : ''}">Calm & Grounded</div>
            </div>
        `;
        
        // Add to step content
        const stepContent = document.querySelector('#step2 .step-content');
        stepContent.appendChild(doshaResultDiv);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .dosha-result {
                background: rgba(212, 168, 83, 0.1);
                border-left: 3px solid var(--accent-saffron);
                padding: 1.5rem;
                margin: 1rem 0;
                border-radius: 0px;
                animation: slideIn 0.5s ease;
            }
            
            .dosha-type {
                font-family: var(--font-mono);
                font-size: 14px;
                font-weight: 600;
                color: var(--text-primary);
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }
            
            .dosha-traits {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .trait {
                padding: 0.5rem 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 0px;
                font-family: var(--font-body);
                font-size: 12px;
                color: var(--text-secondary);
                transition: all 0.3s ease;
            }
            
            .trait.active {
                background: rgba(212, 168, 83, 0.2);
                color: var(--text-primary);
            }
            
            .trait.vata.active {
                border-left: 2px solid var(--dosha-vata);
            }
            
            .trait.pitta.active {
                border-left: 2px solid var(--dosha-pitta);
            }
            
            .trait.kapha.active {
                border-left: 2px solid var(--dosha-kapha);
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    function completeOnboardingProcess() {
        // Show loading state
        completeOnboarding.textContent = 'Processing...';
        completeOnboarding.disabled = true;
        
        // Calculate dosha based on answers
        const doshaResult = calculateDosha(userData.doshaAnswers);
        userData.dosha = doshaResult;
        
        // Log all user data for debugging
        console.log('Complete user data:', userData);
        console.log('Schedule:', userData.schedule);
        console.log('Preferences:', userData.preferences);
        console.log('Permissions:', userData.permissions);
        
        // Save to localStorage
        localStorage.setItem('kedar_user_data', JSON.stringify(userData));
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            showNotification('Welcome to KEDAR! Setting up your personalized experience...', 'success');
            
            // Show completion message
            const completionDiv = document.createElement('div');
            completionDiv.className = 'completion-message';
            completionDiv.innerHTML = `
                <h4>Setup Complete! 🎉</h4>
                <p>Your personalized wellness journey is ready.</p>
                <p>Redirecting to your dashboard...</p>
            `;
            
            // Add to current step
            const currentStepEl = document.querySelector('.onboarding-step.active');
            if (currentStepEl) {
                currentStepEl.querySelector('.step-content').appendChild(completionDiv);
            }
            
            // Add styles for completion message
            const style = document.createElement('style');
            style.textContent = `
                .completion-message {
                    background: rgba(122, 184, 122, 0.1);
                    border-left: 3px solid var(--dosha-kapha);
                    padding: 1.5rem;
                    margin: 1rem 0;
                    border-radius: 0px;
                    text-align: center;
                    animation: slideIn 0.5s ease;
                }
                
                .completion-message h4 {
                    font-family: var(--font-body);
                    font-size: 18px;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }
                
                .completion-message p {
                    font-family: var(--font-body);
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin: 0.25rem 0;
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Redirect to dashboard after delay
            setTimeout(() => {
                console.log('Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            }, 3000);
        }, 1500);
    }

    function calculateDosha(answers) {
        // Simple dosha calculation based on answers
        const doshaCounts = { vata: 0, pitta: 0, kapha: 0 };
        
        Object.values(answers).forEach(answer => {
            if (doshaCounts.hasOwnProperty(answer)) {
                doshaCounts[answer]++;
            }
        });
        
        // Find dominant dosha
        let maxDosha = 'vata';
        let maxCount = 0;
        
        for (const [dosha, count] of Object.entries(doshaCounts)) {
            if (count > maxCount) {
                maxCount = count;
                maxDosha = dosha;
            }
        }
        
        return maxDosha;
    }

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

    // Add CSS for notifications and ripple effects
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
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Enter key advances to next step
            const activeStep = document.querySelector('.onboarding-step.active');
            const nextButton = activeStep.querySelector('.nav-button.primary, .nav-button.accent');
            if (nextButton && !nextButton.disabled) {
                nextButton.click();
            }
        } else if (e.key === 'Escape') {
            // Escape key goes back (if not on first step)
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        }
    });

    // Auto-save progress to localStorage
    function saveProgress() {
        localStorage.setItem('kedar_onboarding_progress', JSON.stringify({
            currentStep,
            userData
        }));
    }

    function loadProgress() {
        const saved = localStorage.getItem('kedar_onboarding_progress');
        if (saved) {
            const data = JSON.parse(saved);
            currentStep = data.currentStep || 1;
            userData = { ...userData, ...data.userData };
            
            // Restore form values
            if (userData.name) {
                document.getElementById('userName').value = userData.name;
            }
            
            // Restore goal selections
            userData.goals.forEach(goal => {
                const goalCard = document.querySelector(`[data-goal="${goal}"]`);
                if (goalCard) goalCard.classList.add('selected');
            });
            
            // Restore schedule
            Object.entries(userData.schedule).forEach(([key, value]) => {
                const input = document.getElementById(key);
                if (input) input.value = value;
            });
            
            // Restore preferences
            Object.entries(userData.preferences).forEach(([key, value]) => {
                const checkbox = document.getElementById(key);
                if (checkbox) checkbox.checked = value;
            });
            
            // Restore permissions
            Object.entries(userData.permissions).forEach(([key, value]) => {
                const checkbox = document.getElementById(key + 'Permission');
                if (checkbox) checkbox.checked = value;
            });
            
            // Go to saved step
            goToStep(currentStep);
        }
    }

    // Auto-save on any input change
    document.addEventListener('input', saveProgress);
    document.addEventListener('change', saveProgress);

    // Load saved progress on page load
    loadProgress();

    console.log('KEDAR enhanced onboarding initialized successfully');
});

// Enhanced onboarding utility functions
const Onboarding = {
    // Validate email format
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Get wellness recommendations based on goals
    getRecommendations: (goals) => {
        const recommendations = {
            stress: ['Meditation', 'Breathing exercises', 'Adaptogenic herbs'],
            sleep: ['Sleep hygiene routine', 'Chamomile tea', 'Digital sunset'],
            focus: ['Pomodoro technique', 'Brain foods', 'Minimize distractions'],
            posture: ['Ergonomic setup', 'Posture reminders', 'Stretching breaks'],
            energy: ['Regular exercise', 'Balanced nutrition', 'Hydration tracking'],
            balance: ['Time boundaries', 'Mindful transitions', 'Self-care rituals']
        };
        
        const userRecommendations = [];
        goals.forEach(goal => {
            if (recommendations[goal]) {
                userRecommendations.push(...recommendations[goal]);
            }
        });
        
        return [...new Set(userRecommendations)]; // Remove duplicates
    },
    
    // Calculate optimal schedule based on dosha and preferences
    calculateOptimalSchedule: (dosha, preferences) => {
        const schedules = {
            vata: {
                wake: '06:00',
                sleep: '22:00',
                meditation: '06:30',
                exercise: '07:00',
                meals: ['08:00', '13:00', '19:00']
            },
            pitta: {
                wake: '05:30',
                sleep: '22:30',
                meditation: '05:45',
                exercise: '17:30',
                meals: ['07:00', '12:00', '18:00']
            },
            kapha: {
                wake: '05:00',
                sleep: '21:30',
                meditation: '05:15',
                exercise: '06:00',
                meals: ['07:30', '12:30', '18:30']
            }
        };
        
        return schedules[dosha] || schedules.vata;
    }
};
