// Netra Vision Guard JavaScript - KEDAR Platform
document.addEventListener('DOMContentLoaded', function() {
    // Initialize live time
    updateLiveTime();
    setInterval(updateLiveTime, 1000);

    // Netra monitoring state
    let isMonitoring = true;
    let monitoringStartTime = Date.now() - (2 * 60 * 60 * 1000); // Started 2 hours ago
    let sessionTimer = null;
    let updateInterval = null;
    let alertCount = 3;

    // Current metrics
    let currentMetrics = {
        blinkRate: 12,
        faceProximity: 45,
        neckTilt: 15,
        timeSinceBreak: 45
    };

    // Thresholds
    let thresholds = {
        blinkRate: 15,
        proximity: 40,
        breakInterval: 30
    };

    // DOM elements
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const statusDuration = document.getElementById('statusDuration');
    const toggleMonitoringBtn = document.getElementById('toggleMonitoring');
    const resetSessionBtn = document.getElementById('resetSession');

    // Settings elements
    const enableNetraCheckbox = document.getElementById('enableNetra');
    const blinkThresholdSlider = document.getElementById('blinkThreshold');
    const proximityThresholdSlider = document.getElementById('proximityThreshold');
    const breakIntervalSlider = document.getElementById('breakInterval');
    const alertSoundCheckbox = document.getElementById('alertSound');
    const desktopNotificationsCheckbox = document.getElementById('desktopNotifications');

    // Event listeners
    toggleMonitoringBtn.addEventListener('click', toggleMonitoring);
    resetSessionBtn.addEventListener('click', resetSession);

    // Settings listeners
    enableNetraCheckbox.addEventListener('change', function() {
        if (this.checked && !isMonitoring) {
            startMonitoring();
        } else if (!this.checked && isMonitoring) {
            pauseMonitoring();
        }
    });

    blinkThresholdSlider.addEventListener('input', function() {
        thresholds.blinkRate = parseInt(this.value);
        document.getElementById('blinkThresholdValue').textContent = this.value;
    });

    proximityThresholdSlider.addEventListener('input', function() {
        thresholds.proximity = parseInt(this.value);
        document.getElementById('proximityThresholdValue').textContent = this.value;
    });

    breakIntervalSlider.addEventListener('input', function() {
        thresholds.breakInterval = parseInt(this.value);
        document.getElementById('breakIntervalValue').textContent = this.value;
    });

    // Monitoring control functions
    function toggleMonitoring() {
        if (isMonitoring) {
            pauseMonitoring();
        } else {
            startMonitoring();
        }
    }

    function startMonitoring() {
        isMonitoring = true;
        statusDot.className = 'status-dot monitoring';
        statusText.textContent = 'MONITORING';
        toggleMonitoringBtn.textContent = 'Pause';
        toggleMonitoringBtn.classList.add('active');
        enableNetraCheckbox.checked = true;
        
        // Start updating metrics
        if (!updateInterval) {
            updateInterval = setInterval(updateMetrics, 2000);
        }
        
        showNotification('Netra monitoring started', 'success');
    }

    function pauseMonitoring() {
        isMonitoring = false;
        statusDot.className = 'status-dot resting';
        statusText.textContent = 'RESTING';
        toggleMonitoringBtn.textContent = 'Resume';
        toggleMonitoringBtn.classList.remove('active');
        enableNetraCheckbox.checked = false;
        
        // Stop updating metrics
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
        
        showNotification('Netra monitoring paused', 'info');
    }

    function resetSession() {
        monitoringStartTime = Date.now();
        alertCount = 0;
        currentMetrics.timeSinceBreak = 0;
        
        updateStatusDuration();
        updateMetrics();
        
        showNotification('Session reset successfully', 'success');
    }

    // Update metrics simulation
    function updateMetrics() {
        if (!isMonitoring) return;
        
        // Simulate realistic metric changes
        currentMetrics.blinkRate = Math.max(8, Math.min(25, 
            currentMetrics.blinkRate + (Math.random() - 0.5) * 4));
        
        currentMetrics.faceProximity = Math.max(30, Math.min(60, 
            currentMetrics.faceProximity + (Math.random() - 0.5) * 5));
        
        currentMetrics.neckTilt = Math.max(0, Math.min(45, 
            currentMetrics.neckTilt + (Math.random() - 0.5) * 3));
        
        currentMetrics.timeSinceBreak += 0.033; // ~2 seconds
        
        // Update UI
        updateMetricsDisplay();
        checkAlerts();
    }

    // Update metrics display
    function updateMetricsDisplay() {
        // Update values
        document.getElementById('blinkRate').textContent = Math.round(currentMetrics.blinkRate);
        document.getElementById('faceProximity').textContent = Math.round(currentMetrics.faceProximity);
        document.getElementById('neckTilt').textContent = Math.round(currentMetrics.neckTilt) + '°';
        
        // Update time since break
        const minutes = Math.floor(currentMetrics.timeSinceBreak);
        document.getElementById('timeSinceBreak').textContent = minutes + 'm';
        
        // Update status bars
        updateStatBar('blinkRate', currentMetrics.blinkRate, 30, thresholds.blinkRate);
        updateStatBar('faceProximity', currentMetrics.faceProximity, 60, thresholds.proximity);
        updateStatBar('neckTilt', currentMetrics.neckTilt, 45, 20); // Alert at 20°
        updateStatBar('timeSinceBreak', currentMetrics.timeSinceBreak, 60, thresholds.breakInterval);
        
        // Update status text
        updateStatStatus('blinkRate', currentMetrics.blinkRate, thresholds.blinkRate, 'Below optimal', 'Optimal');
        updateStatStatus('faceProximity', currentMetrics.faceProximity, thresholds.proximity, 'Too close', 'Optimal');
        updateStatStatus('neckTilt', currentMetrics.neckTilt, 20, 'Forward head', 'Good posture');
        updateStatStatus('timeSinceBreak', currentMetrics.timeSinceBreak, thresholds.breakInterval, 'Break needed', 'Good timing');
    }

    // Update stat bar
    function updateStatBar(statId, value, maxValue, threshold) {
        const statCard = document.getElementById(statId).closest('.stat-card');
        const statBar = statCard.querySelector('.stat-fill');
        const percentage = Math.min(100, (value / maxValue) * 100);
        
        statBar.style.width = percentage + '%';
        
        // Update color based on threshold
        statBar.className = 'stat-fill';
        if (statId === 'blinkRate' && value < threshold) {
            statBar.classList.add('warning');
        } else if (statId === 'faceProximity' && value < threshold) {
            statBar.classList.add('alert');
        } else if (statId === 'neckTilt' && value > threshold) {
            statBar.classList.add('warning');
        } else if (statId === 'timeSinceBreak' && value > threshold) {
            statBar.classList.add('alert');
        } else {
            statBar.classList.add('good');
        }
    }

    // Update stat status
    function updateStatStatus(statId, value, threshold, badText, goodText) {
        const statCard = document.getElementById(statId).closest('.stat-card');
        const statusElement = statCard.querySelector('.stat-status');
        
        statusElement.className = 'stat-status';
        
        if (statId === 'blinkRate' && value < threshold) {
            statusElement.classList.add('warning');
            statusElement.textContent = badText;
        } else if (statId === 'faceProximity' && value < threshold) {
            statusElement.classList.add('alert');
            statusElement.textContent = badText;
        } else if (statId === 'neckTilt' && value > threshold) {
            statusElement.classList.add('warning');
            statusElement.textContent = badText;
        } else if (statId === 'timeSinceBreak' && value > threshold) {
            statusElement.classList.add('alert');
            statusElement.textContent = badText;
        } else {
            statusElement.classList.add('good');
            statusElement.textContent = goodText;
        }
    }

    // Check for alerts
    function checkAlerts() {
        // Blink rate alert
        if (currentMetrics.blinkRate < thresholds.blinkRate && Math.random() > 0.8) {
            triggerAlert('Low Blink Rate Detected', 
                `Blink rate dropped to ${Math.round(currentMetrics.blinkRate)} bpm. Consider taking eye rest.`, 
                'alert');
        }
        
        // Proximity alert
        if (currentMetrics.faceProximity < thresholds.proximity && Math.random() > 0.9) {
            triggerAlert('Too Close to Screen', 
                `Face is ${Math.round(currentMetrics.faceProximity)}cm from screen. Maintain proper distance.`, 
                'warning');
        }
        
        // Neck tilt alert
        if (currentMetrics.neckTilt > 20 && Math.random() > 0.85) {
            triggerAlert('Forward Head Posture', 
                `Neck tilt angle is ${Math.round(currentMetrics.neckTilt)}°. Adjust your posture.`, 
                'warning');
        }
        
        // Break reminder
        if (currentMetrics.timeSinceBreak >= thresholds.breakInterval && 
            currentMetrics.timeSinceBreak < thresholds.breakInterval + 0.1) {
            triggerAlert('Break Reminder', 
                'Time for your 20-20-20 eye exercise break.', 
                'info');
            currentMetrics.timeSinceBreak = 0; // Reset after alert
        }
    }

    // Trigger alert
    function triggerAlert(title, description, type) {
        alertCount++;
        
        // Update alert count in status
        document.querySelector('.status-alerts').textContent = `${alertCount} alerts today`;
        
        // Add to alert history
        addAlertToHistory(title, description, type);
        
        // Show notification
        showNotification(title, type);
        
        // Play sound if enabled
        if (alertSoundCheckbox.checked) {
            playAlertSound();
        }
        
        // Desktop notification if enabled
        if (desktopNotificationsCheckbox && 'Notification' in window && 
            Notification.permission === 'granted') {
            new Notification(title, {
                body: description,
                icon: '/favicon.ico'
            });
        }
    }

    // Add alert to history
    function addAlertToHistory(title, description, type) {
        const alertTimeline = document.querySelector('.alert-timeline');
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item ${type}`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const iconMap = {
            'alert': '⚠️',
            'warning': '🦴',
            'info': '⏱️',
            'success': '✅'
        };
        
        alertItem.innerHTML = `
            <div class="alert-time">${time}</div>
            <div class="alert-content">
                <div class="alert-title">${title}</div>
                <div class="alert-description">${description}</div>
            </div>
            <div class="alert-icon">${iconMap[type] || '📢'}</div>
        `;
        
        // Insert at the beginning
        alertTimeline.insertBefore(alertItem, alertTimeline.firstChild);
        
        // Keep only last 10 alerts
        const alerts = alertTimeline.querySelectorAll('.alert-item');
        if (alerts.length > 10) {
            alerts[alerts.length - 1].remove();
        }
    }

    // Play alert sound
    function playAlertSound() {
        // Create a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Update status duration
    function updateStatusDuration() {
        const elapsed = Math.floor((Date.now() - monitoringStartTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        
        if (hours > 0) {
            statusDuration.textContent = `Active for ${hours}h ${minutes}m`;
        } else {
            statusDuration.textContent = `Active for ${minutes}m`;
        }
    }

    // Exercise buttons
    const exerciseButtons = document.querySelectorAll('.exercise-button');
    exerciseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const exerciseCard = this.closest('.exercise-card');
            const exerciseName = exerciseCard.querySelector('.exercise-title').textContent;
            
            // Start exercise
            startEyeExercise(exerciseName);
        });
    });

    // Start eye exercise
    function startEyeExercise(exerciseName) {
        showNotification(`Starting ${exerciseName} exercise`, 'info');
        
        // Simulate exercise duration
        setTimeout(() => {
            showNotification(`${exerciseName} exercise completed!`, 'success');
        }, 30000); // 30 seconds
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
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
            background: ${type === 'alert' ? 'var(--dosha-pitta)' : type === 'warning' ? 'var(--accent-warm)' : type === 'success' ? 'var(--dosha-kapha)' : 'var(--dosha-vata)'};
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

    // Start monitoring by default
    startMonitoring();

    // Update status duration every minute
    setInterval(updateStatusDuration, 60000);

    console.log('Netra Vision Guard initialized successfully');
});

// Netra-specific utility functions
const Netra = {
    // Calculate eye strain score
    calculateEyeStrain: (blinkRate, screenTime, proximity) => {
        let strainScore = 0;
        
        // Low blink rate increases strain
        if (blinkRate < 15) strainScore += (15 - blinkRate) * 2;
        
        // Long screen time increases strain
        if (screenTime > 120) strainScore += (screenTime - 120) / 30;
        
        // Close proximity increases strain
        if (proximity < 40) strainScore += (40 - proximity);
        
        return Math.min(100, Math.round(strainScore));
    },
    
    // Get posture recommendations
    getPostureRecommendations: (neckTilt, proximity) => {
        const recommendations = [];
        
        if (neckTilt > 20) {
            recommendations.push('Adjust monitor height to eye level');
            recommendations.push('Consider using a monitor stand');
        }
        
        if (proximity < 40) {
            recommendations.push('Increase distance from screen');
            recommendations.push('Use larger font size if needed');
        }
        
        return recommendations;
    }
};
