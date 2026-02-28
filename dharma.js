// Dharma Engine JavaScript - KEDAR Platform
document.addEventListener('DOMContentLoaded', function() {
    // Initialize live time
    updateLiveTime();
    setInterval(updateLiveTime, 1000);

    // Character counter for dilemma textarea
    const dilemmaInput = document.getElementById('dilemmaInput');
    const characterCount = document.querySelector('.character-count');
    const seekGuidanceBtn = document.getElementById('seekGuidance');
    const responseSection = document.getElementById('responseSection');

    dilemmaInput.addEventListener('input', function() {
        const length = this.value.length;
        const maxLength = 500;
        characterCount.textContent = `${length} / ${maxLength}`;
        
        if (length > maxLength) {
            this.value = this.value.substring(0, maxLength);
            characterCount.textContent = `${maxLength} / ${maxLength}`;
        }
        
        // Enable/disable button based on content
        seekGuidanceBtn.disabled = length < 10;
    });

    // Seek Guidance functionality
    seekGuidanceBtn.addEventListener('click', function() {
        const dilemma = dilemmaInput.value.trim();
        if (dilemma.length < 10) return;
        
        // Show loading state
        this.textContent = 'Analyzing...';
        this.disabled = true;
        
        // Simulate AI processing
        setTimeout(() => {
            generateDharmaResponse(dilemma);
            this.textContent = 'Seek Guidance →';
            this.disabled = false;
        }, 2000);
    });

    // Generate Dharma Response
    function generateDharmaResponse(dilemma) {
        // Analyze the dilemma and generate appropriate response
        const analysis = analyzeDilemma(dilemma);
        
        // Update response sections
        document.getElementById('situationSummary').textContent = analysis.summary;
        document.getElementById('gitaChapter').textContent = analysis.gitaChapter;
        document.getElementById('gitaQuote').textContent = analysis.gitaQuote;
        document.getElementById('ethicalInterpretation').textContent = analysis.interpretation;
        document.getElementById('reflectionQuestion').textContent = analysis.reflection;
        
        // Update practical advice
        const adviceList = document.getElementById('practicalAdvice');
        adviceList.innerHTML = '';
        analysis.advice.forEach(advice => {
            const li = document.createElement('li');
            li.textContent = advice;
            adviceList.appendChild(li);
        });
        
        // Update Gunas with animation
        updateGunas(analysis.gunas);
        
        // Show response section
        responseSection.style.display = 'block';
        responseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Save to memory
        saveToMemory(dilemma, analysis);
    }

    // Analyze dilemma based on keywords
    function analyzeDilemma(dilemma) {
        const lowerDilemma = dilemma.toLowerCase();
        
        // Base response template
        let response = {
            summary: "You are facing a significant ethical dilemma that requires careful consideration of your values and principles.",
            gitaChapter: "Bhagavad Gita 2.47",
            gitaQuote: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
            interpretation: "",
            reflection: "What would you do if success were guaranteed regardless of your choice?",
            advice: [],
            gunas: { sattva: 60, rajas: 25, tamas: 15 }
        };
        
        // Customize based on dilemma content
        if (lowerDilemma.includes('career') || lowerDilemma.includes('work') || lowerDilemma.includes('job')) {
            response.summary = "You are experiencing a conflict between professional ambition and personal integrity, a common challenge in modern career paths.";
            response.gitaChapter = "Bhagavad Gita 3.30";
            response.gitaQuote = "Dedicate all your activities to Me, with your mind focused on the Self, and free from desire, attachment, and mental agitation.";
            response.interpretation = "Your dilemma reflects the eternal tension between Artha (material prosperity) and Dharma (righteous duty). The Gita teaches that true success lies not in external achievements but in performing one's duty with detachment and integrity.";
            response.advice = [
                "Evaluate whether the promotion aligns with your core values and long-term purpose",
                "Consider alternative paths that honor both your career goals and ethical principles",
                "Practice detachment from outcomes while performing your current duties diligently",
                "Seek guidance from mentors who embody both professional success and ethical conduct",
                "Remember that sustainable success comes from alignment, not compromise"
            ];
            response.gunas = { sattva: 65, rajas: 25, tamas: 10 };
        } else if (lowerDilemma.includes('relationship') || lowerDilemma.includes('family') || lowerDilemma.includes('friend')) {
            response.summary = "You are navigating complex interpersonal dynamics that test your emotional wisdom and ethical boundaries.";
            response.gitaChapter = "Bhagavad Gita 12.13";
            response.gitaQuote = "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, who is tolerant, always satisfied, self-controlled, and engaged in devotional service with determination, whose mind and intelligence are in agreement with Me... is dear to Me.";
            response.interpretation = "Relationships provide our greatest spiritual tests and opportunities for growth. The Gita emphasizes compassion, forgiveness, and seeing the divine in others while maintaining healthy boundaries.";
            response.advice = [
                "Practice compassion while maintaining clear boundaries",
                "Listen deeply to understand before seeking to be understood",
                "Consider whether your actions serve the highest good of all involved",
                "Practice forgiveness, both for others and yourself",
                "Remember that true love allows space for growth and individuality"
            ];
            response.gunas = { sattva: 70, rajas: 20, tamas: 10 };
        } else if (lowerDilemma.includes('money') || lowerDilemma.includes('financial') || lowerDilemma.includes('business')) {
            response.summary = "You are facing ethical questions around material wealth and its proper use in your life.";
            response.gitaChapter = "Bhagavad Gita 4.22";
            response.gitaQuote = "One who is satisfied with gain which comes of its own accord, who is free from duality and does not envy, who is steady in both success and failure, is never entangled, although performing actions.";
            response.interpretation = "The Gita teaches that wealth is neither inherently good nor bad, but our attachment to it creates suffering. Right use of wealth involves generosity, detachment, and seeing it as a tool for dharma rather than an end in itself.";
            response.advice = [
                "Evaluate whether your financial choices align with your deeper values",
                "Practice generosity and consider the welfare of others in financial decisions",
                "Cultivate detachment from both gain and loss",
                "Use wealth as a tool for spiritual growth and service to others",
                "Remember that true wealth lies in contentment, not accumulation"
            ];
            response.gunas = { sattva: 55, rajas: 30, tamas: 15 };
        } else {
            response.interpretation = "Every dilemma offers an opportunity to deepen your understanding of dharma and strengthen your moral character. The Gita teaches that clarity comes from detachment, wisdom, and surrender to higher wisdom.";
            response.advice = [
                "Take time for quiet reflection before making your decision",
                "Consider the long-term consequences of each possible action",
                "Seek counsel from those who embody wisdom and integrity",
                "Ask yourself what action would serve the highest good",
                "Trust your inner wisdom while remaining open to guidance"
            ];
        }
        
        return response;
    }

    // Update Gunas display with animation
    function updateGunas(gunas) {
        const gunaElements = {
            sattva: document.querySelector('.guna-fill.sattva'),
            rajas: document.querySelector('.guna-fill.rajas'),
            tamas: document.querySelector('.guna-fill.tamas')
        };
        
        const percentages = {
            sattva: document.querySelector('.guna-item:nth-child(1) .guna-percentage'),
            rajas: document.querySelector('.guna-item:nth-child(2) .guna-percentage'),
            tamas: document.querySelector('.guna-item:nth-child(3) .guna-percentage')
        };
        
        // Animate the changes
        Object.keys(gunas).forEach(guna => {
            if (gunaElements[guna]) {
                setTimeout(() => {
                    gunaElements[guna].style.width = gunas[guna] + '%';
                    percentages[guna].textContent = gunas[guna] + '%';
                }, 200);
            }
        });
    }

    // Memory accordion functionality
    const memoryToggles = document.querySelectorAll('.memory-toggle');
    memoryToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const memoryId = this.dataset.memory;
            const memoryItem = this.closest('.memory-item');
            const memoryContent = document.getElementById(`memory-${memoryId}`);
            
            // Toggle expanded state
            memoryItem.classList.toggle('expanded');
            
            // Toggle content visibility
            if (memoryItem.classList.contains('expanded')) {
                memoryContent.style.display = 'block';
            } else {
                memoryContent.style.display = 'none';
            }
        });
    });

    // Quick action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.querySelector('.action-title').textContent;
            handleQuickAction(action);
        });
    });

    function handleQuickAction(action) {
        switch(action) {
            case 'Study Gita Principles':
                window.open('https://www.holy-bhagavad-gita.org/', '_blank');
                break;
            case 'Meditate on Decision':
                alert('Starting guided meditation for decision clarity...\n\nFind a quiet place and focus on your breath for 5 minutes before returning to your dilemma.');
                break;
            case 'Journal Reflection':
                dilemmaInput.focus();
                dilemmaInput.value = "Reflection on my current dilemma:\n\nWhat I know for certain:\nWhat I'm uncertain about:\nMy core values involved:\nPossible outcomes:\n\nMy intuition tells me...";
                updateCharacterCount();
                break;
        }
    }

    // Save to memory function
    function saveToMemory(dilemma, analysis) {
        const memory = {
            date: new Date().toISOString(),
            dilemma: dilemma.substring(0, 100) + '...',
            guidance: analysis.summary.substring(0, 100) + '...',
            fullAnalysis: analysis
        };
        
        // In a real application, this would save to a backend
        console.log('Saved to memory:', memory);
        
        // Update the memory accordion (in real app, this would be dynamic)
        updateMemoryDisplay(memory);
    }

    function updateMemoryDisplay(memory) {
        // This would dynamically add new memories to the accordion
        // For now, we'll just log it
        console.log('Memory updated with:', memory);
    }

    // Helper function to update character count
    function updateCharacterCount() {
        const length = dilemmaInput.value.length;
        characterCount.textContent = `${length} / 500`;
        seekGuidanceBtn.disabled = length < 10;
    }

    // Add keyboard shortcut for submitting (Ctrl/Cmd + Enter)
    dilemmaInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!seekGuidanceBtn.disabled) {
                seekGuidanceBtn.click();
            }
        }
    });

    // Initialize with sample dilemma for demonstration
    if (dilemmaInput.value.length === 0) {
        dilemmaInput.value = "I'm facing a difficult decision where I need to choose between my career advancement and staying true to my personal values. The promotion would require compromising on work-life balance and potentially working on projects that don't align with my ethical principles...";
        updateCharacterCount();
    }

    console.log('Dharma Engine initialized successfully');
});

// Dharma-specific utility functions
const Dharma = {
    // Get Gita verse by chapter and verse
    getGitaVerse: (chapter, verse) => {
        const verses = {
            '2.47': "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
            '3.30': "Dedicate all your activities to Me, with your mind focused on the Self, and free from desire, attachment, and mental agitation.",
            '12.13': "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, who is tolerant, always satisfied, self-controlled, and engaged in devotional service with determination, whose mind and intelligence are in agreement with Me... is dear to Me.",
            '4.22': "One who is satisfied with gain which comes of its own accord, who is free from duality and does not envy, who is steady in both success and failure, is never entangled, although performing actions."
        };
        return verses[`${chapter}.${verse}`] || "Verse not found";
    },
    
    // Calculate guna balance based on text analysis
    calculateGunas: (text) => {
        const lowerText = text.toLowerCase();
        let sattva = 50, rajas = 25, tamas = 25;
        
        // Simple keyword-based analysis
        if (lowerText.includes('peace') || lowerText.includes('calm') || lowerText.includes('truth')) sattva += 15;
        if (lowerText.includes('anger') || lowerText.includes('stress') || lowerText.includes('urgency')) rajas += 15;
        if (lowerText.includes('confusion') || lowerText.includes('lazy') || lowerText.includes('fear')) tamas += 15;
        
        // Normalize to 100%
        const total = sattva + rajas + tamas;
        return {
            sattva: Math.round((sattva / total) * 100),
            rajas: Math.round((rajas / total) * 100),
            tamas: Math.round((tamas / total) * 100)
        };
    }
};
