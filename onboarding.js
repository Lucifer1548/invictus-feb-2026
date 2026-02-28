// Onboarding Flow JavaScript - KEDAR Platform
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

        // Step 3: Schedule
        ['wakeTime', 'sleepTime', 'workStart', 'workEnd'].forEach(id => {
            document.getElementById(id).addEventListener('change', function() {
                userData.schedule[id] = this.value;
            });
        });

        // Preference toggles
        ['morningMeditation', 'yogaBreak', 'eyeExercises', 'eveningWindDown'].forEach(id => {
            document.getElementById(id).addEventListener('change', function() {
                userData.preferences[id] = this.checked;
            });
        });

        // Step 4: Permissions
        ['cameraPermission', 'calendarPermission', 'notificationPermission'].forEach(id => {
            document.getElementById(id).addEventListener('change', function() {
                const permission = id.replace('Permission', '');
                userData.permissions[permission] = this.checked;
            });
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
