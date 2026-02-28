// Ayur Assistant JavaScript - KEDAR Platform
document.addEventListener('DOMContentLoaded', function() {
    // Initialize live time
    updateLiveTime();
    setInterval(updateLiveTime, 1000);

    // Chat functionality
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    const suggestionPills = document.querySelectorAll('.suggestion-pill');

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        
        // Enable/disable send button
        sendButton.disabled = this.value.trim().length === 0;
    });

    // Send message functionality
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message.length === 0) return;

        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        sendButton.disabled = true;

        // Simulate AI response
        setTimeout(() => {
            const response = generateAyurResponse(message);
            addMessage(response.text, 'ai', response.suggestions, response.tags);
        }, 1000 + Math.random() * 1000);
    }

    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Add message to chat
    function addMessage(text, sender, suggestions = [], tags = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        let messageHTML = `
            <div class="message-avatar">
                <span class="avatar-icon">${sender === 'user' ? '👤' : '🌿'}</span>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">${sender === 'user' ? 'You' : 'Ayur Assistant'}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${text}</div>
        `;

        // Add suggestions if present
        if (suggestions.length > 0) {
            messageHTML += '<div class="message-suggestions">';
            suggestions.forEach(suggestion => {
                messageHTML += `
                    <div class="suggestion-item">
                        <span class="suggestion-icon">${suggestion.icon}</span>
                        <div class="suggestion-content">
                            <strong>${suggestion.title}</strong>
                            <p>${suggestion.description}</p>
                        </div>
                    </div>
                `;
            });
            messageHTML += '</div>';
        }

        // Add tags if present
        if (tags.length > 0) {
            messageHTML += '<div class="message-tags">';
            tags.forEach(tag => {
                messageHTML += `<span class="tag">[${tag}]</span>`;
            });
            messageHTML += '</div>';
        }

        messageHTML += '</div>';
        messageDiv.innerHTML = messageHTML;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Generate Ayur response based on input
    function generateAyurResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Response templates
        const responses = {
            dosha: {
                text: "Based on your current symptoms and constitution analysis, you appear to have a Vata-dominant constitution with current imbalance. Vata types are typically creative, quick-thinking, and prone to anxiety when imbalanced.",
                suggestions: [
                    {
                        icon: '🍵',
                        title: 'Vata Balancing Tea',
                        description: 'Warm ginger, cinnamon, and cardamom tea with honey'
                    },
                    {
                        icon: '🧴',
                        title: 'Abhyanga Practice',
                        description: 'Daily warm sesame oil self-massage, 15 minutes'
                    },
                    {
                        icon: '🥘',
                        title: 'Grounding Diet',
                        description: 'Warm, cooked foods with root vegetables and healthy fats'
                    }
                ],
                tags: ['AYR-004', 'Dosha Analysis', 'Vata']
            },
            anxiety: {
                text: "For anxiety and scattered energy, focus on grounding practices that calm Vata dosha. Your nervous system needs nourishment and stability.",
                suggestions: [
                    {
                        icon: '🧘',
                        title: 'Alternate Nostril Breathing',
                        description: 'Nadi Shodhana: 5 minutes, 3 times daily'
                    },
                    {
                        icon: '🌿',
                        title: 'Ashwagandha Supplement',
                        description: '500mg with warm milk before bedtime'
                    },
                    {
                        icon: '🕯️',
                        title: 'Grounding Aromatherapy',
                        description: 'Sandalwood or lavender essential oil diffusion'
                    }
                ],
                tags: ['AYR-005', 'Anxiety Relief', 'Vata Balance']
            },
            sleep: {
                text: "Quality sleep is crucial for Vata balance. Your scattered energy indicates nervous system overstimulation that affects sleep patterns.",
                suggestions: [
                    {
                        icon: '🥛',
                        title: 'Golden Milk',
                        description: 'Warm milk with turmeric, cardamom, and nutmeg'
                    },
                    {
                        icon: '📱',
                        title: 'Digital Sunset',
                        description: 'No screens 1 hour before bedtime'
                    },
                    {
                        icon: '👣',
                        title: 'Foot Massage',
                        description: 'Warm ghee massage on soles before sleep'
                    }
                ],
                tags: ['AYR-006', 'Sleep Health', 'Vata']
            },
            digestion: {
                text: "Vata types often experience irregular digestion. Focus on warm, easily digestible foods and regular eating schedules.",
                suggestions: [
                    {
                        icon: '🍚',
                        title: 'Kitchari Diet',
                        description: 'Mung beans and basmati rice with digestive spices'
                    },
                    {
                        icon: '🌾',
                        title: 'Ginger Tea',
                        description: 'Fresh ginger tea 20 minutes before meals'
                    },
                    {
                        icon: '⏰',
                        title: 'Regular Schedule',
                        description: 'Eat meals at same times daily, avoid skipping'
                    }
                ],
                tags: ['AYR-007', 'Digestive Health', 'Vata']
            },
            morning: {
                text: "A grounding morning routine sets the tone for balanced Vata throughout the day. Start with gentle, warming practices.",
                suggestions: [
                    {
                        icon: '👅',
                        title: 'Tongue Scraping',
                        description: 'Remove toxins, stimulate digestion'
                    },
                    {
                        icon: '🥤',
                        title: 'Warm Lemon Water',
                        description: 'Room temperature, not cold, with honey'
                    },
                    {
                        icon: '🌅',
                        title: 'Sun Salutation',
                        description: 'Slow, mindful Surya Namaskar, 3 rounds'
                    }
                ],
                tags: ['AYR-008', 'Morning Routine', 'Dinacharya']
            }
        };

        // Determine response based on keywords
        let response = responses.dosha; // default
        
        if (lowerInput.includes('anxious') || lowerInput.includes('anxiety') || lowerInput.includes('stress') || lowerInput.includes('scattered')) {
            response = responses.anxiety;
        } else if (lowerInput.includes('sleep') || lowerInput.includes('insomnia') || lowerInput.includes('tired')) {
            response = responses.sleep;
        } else if (lowerInput.includes('digestion') || lowerInput.includes('stomach') || lowerInput.includes('bloating') || lowerInput.includes('appetite')) {
            response = responses.digestion;
        } else if (lowerInput.includes('morning') || lowerInput.includes('routine') || lowerInput.includes('wake up')) {
            response = responses.morning;
        } else if (lowerInput.includes('dosha') || lowerInput.includes('constitution') || lowerInput.includes('type')) {
            response = responses.dosha;
        }

        return response;
    }

    // Suggestion pills functionality
    suggestionPills.forEach(pill => {
        pill.addEventListener('click', function() {
            chatInput.value = this.textContent;
            chatInput.focus();
            
            // Trigger send after a short delay
            setTimeout(() => {
                sendMessage();
            }, 100);
        });
    });

    // Animate dosha gauges on load
    function animateDoshaGauges() {
        const gauges = [
            { selector: '.vata-gauge', value: 50 },
            { selector: '.pitta-gauge', value: 30 },
            { selector: '.kapha-gauge', value: 20 }
        ];

        gauges.forEach((gauge, index) => {
            setTimeout(() => {
                const element = document.querySelector(gauge.selector);
                if (element) {
                    const circumference = 2 * Math.PI * 40;
                    const offset = circumference - (gauge.value / 100) * circumference;
                    element.style.strokeDashoffset = offset;
                }
            }, index * 200);
        });
    }

    // Start gauge animation after page load
    setTimeout(animateDoshaGauges, 500);

    // Update live suggestions based on time
    function updateLiveSuggestions() {
        const hour = new Date().getHours();
        const suggestionCards = document.querySelectorAll('.suggestion-card');
        
        suggestionCards.forEach((card, index) => {
            const timeElement = card.querySelector('.suggestion-time');
            let timeText = 'Now';
            
            if (index === 0 && hour >= 6 && hour < 10) {
                timeText = 'Morning';
            } else if (index === 1 && hour >= 18 && hour < 22) {
                timeText = 'Evening';
            } else if (index === 2 && hour >= 7 && hour < 9) {
                timeText = 'Today';
            } else if (index === 3) {
                timeText = 'Daily';
            }
            
            if (timeElement) {
                timeElement.textContent = timeText;
            }
        });
    }

    updateLiveSuggestions();
    setInterval(updateLiveSuggestions, 60000); // Update every minute

    // Simulate real-time dosha changes
    function simulateDoshaChanges() {
        const vataGauge = document.querySelector('.vata-gauge');
        const pittaGauge = document.querySelector('.pitta-gauge');
        const kaphaGauge = document.querySelector('.kapha-gauge');
        
        // Small random variations
        const vataValue = 50 + Math.floor(Math.random() * 10) - 5;
        const pittaValue = 30 + Math.floor(Math.random() * 8) - 4;
        const kaphaValue = 20 + Math.floor(Math.random() * 6) - 3;
        
        // Normalize to 100%
        const total = vataValue + pittaValue + kaphaValue;
        const normalizedVata = Math.round((vataValue / total) * 100);
        const normalizedPitta = Math.round((pittaValue / total) * 100);
        const normalizedKapha = Math.round((kaphaValue / total) * 100);
        
        // Update gauges
        const circumference = 2 * Math.PI * 40;
        
        if (vataGauge) {
            vataGauge.style.strokeDashoffset = circumference - (normalizedVata / 100) * circumference;
            document.querySelector('.vata-gauge').closest('.dosha-gauge').querySelector('.gauge-value').textContent = normalizedVata + '%';
        }
        
        if (pittaGauge) {
            pittaGauge.style.strokeDashoffset = circumference - (normalizedPitta / 100) * circumference;
            document.querySelector('.pitta-gauge').closest('.dosha-gauge').querySelector('.gauge-value').textContent = normalizedPitta + '%';
        }
        
        if (kaphaGauge) {
            kaphaGauge.style.strokeDashoffset = circumference - (normalizedKapha / 100) * circumference;
            document.querySelector('.kapha-gauge').closest('.dosha-gauge').querySelector('.gauge-value').textContent = normalizedKapha + '%';
        }
    }

    // Update dosha values every 30 seconds
    setInterval(simulateDoshaChanges, 30000);

    // Add typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <span class="avatar-icon">🌿</span>
            </div>
            <div class="message-content">
                <div class="message-text">
                    <span class="typing-dots">
                        <span class="dot">.</span>
                        <span class="dot">.</span>
                        <span class="dot">.</span>
                    </span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return typingDiv;
    }

    // Add CSS for typing indicator
    const style = document.createElement('style');
    style.textContent = `
        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 8px 0;
        }
        
        .typing-dots .dot {
            width: 8px;
            height: 8px;
            background: var(--text-secondary);
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }
        
        .typing-dots .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.5;
            }
            30% {
                transform: translateY(-10px);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Modify sendMessage to show typing indicator
    const originalSendMessage = sendMessage;
    sendMessage = function() {
        const message = chatInput.value.trim();
        if (message.length === 0) return;

        addMessage(message, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto';
        sendButton.disabled = true;

        const typingIndicator = showTypingIndicator();

        setTimeout(() => {
            typingIndicator.remove();
            const response = generateAyurResponse(message);
            addMessage(response.text, 'ai', response.suggestions, response.tags);
        }, 1000 + Math.random() * 1000);
    };

    console.log('Ayur Assistant initialized successfully');
});

// Ayur-specific utility functions
const Ayur = {
    // Get dosha recommendations based on current state
    getDoshaRecommendations: (vata, pitta, kapha) => {
        const recommendations = [];
        
        if (vata > 50) {
            recommendations.push({
                category: 'Grounding',
                action: 'Warm, nourishing foods and regular routine'
            });
        }
        
        if (pitta > 50) {
            recommendations.push({
                category: 'Cooling',
                action: 'Avoid spicy foods and practice patience'
            });
        }
        
        if (kapha > 50) {
            recommendations.push({
                category: 'Stimulating',
                action: 'Regular exercise and light, dry foods'
            });
        }
        
        return recommendations;
    },
    
    // Calculate optimal meal time based on dosha
    getOptimalMealTime: (dosha) => {
        const mealTimes = {
            vata: { breakfast: '07:00', lunch: '12:00', dinner: '18:00' },
            pitta: { breakfast: '07:30', lunch: '12:30', dinner: '18:30' },
            kapha: { breakfast: '06:30', lunch: '12:00', dinner: '17:30' }
        };
        
        return mealTimes[dosha] || mealTimes.vata;
    }
};
