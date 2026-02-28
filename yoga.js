// Yoga Posture AI JavaScript - KEDAR Platform
document.addEventListener('DOMContentLoaded', function () {
    // Initialize live time
    updateLiveTime();
    setInterval(updateLiveTime, 1000);

    // Camera and pose detection variables
    let video = document.getElementById('videoElement');
    let canvas = document.getElementById('poseCanvas');
    let ctx = canvas.getContext('2d');
    let stream = null;
    let isDetecting = false;
    let sessionActive = false;
    let sessionStartTime = null;
    let sessionTimer = null;
    let poseDetectionInterval = null;

    // Recording variables
    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;

    // Session statistics
    let sessionStats = {
        duration: 0,
        poseCount: 0,
        totalAlignment: 0,
        poses: []
    };

    // DOM elements
    const startCameraBtn = document.getElementById('startCamera');
    const recordCameraBtn = document.getElementById('recordCamera');
    const stopCameraBtn = document.getElementById('stopCamera');
    const switchCameraBtn = document.getElementById('switchCamera');
    const startSessionBtn = document.getElementById('startSession');
    const pauseSessionBtn = document.getElementById('pauseSession');
    const endSessionBtn = document.getElementById('endSession');
    const sensitivitySlider = document.getElementById('sensitivitySlider');
    const showSkeletonCheckbox = document.getElementById('showSkeleton');
    const voiceGuidanceCheckbox = document.getElementById('voiceGuidance');

    // Camera controls
    startCameraBtn.addEventListener('click', startCamera);
    recordCameraBtn.addEventListener('click', toggleRecording);
    stopCameraBtn.addEventListener('click', stopCamera);
    switchCameraBtn.addEventListener('click', switchCamera);

    // Session controls
    startSessionBtn.addEventListener('click', startSession);
    pauseSessionBtn.addEventListener('click', pauseSession);
    endSessionBtn.addEventListener('click', endSession);

    // Settings controls
    sensitivitySlider.addEventListener('input', function () {
        document.querySelector('.setting-value').textContent = this.value;
    });

    // Start camera
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: 'user'
                }
            });

            video.srcObject = stream;
            video.style.display = 'block';
            canvas.style.display = 'none';

            startCameraBtn.disabled = true;
            recordCameraBtn.disabled = false;
            stopCameraBtn.disabled = false;
            switchCameraBtn.disabled = false;

            // Start pose detection after camera is ready
            video.addEventListener('loadedmetadata', () => {
                setTimeout(() => {
                    startPoseDetection();
                }, 1000);
            });

        } catch (error) {
            console.error('Error accessing camera:', error);
            showNotification('Camera access denied or not available', 'error');
        }
    }

    // Stop camera
    function stopCamera() {
        if (isRecording) {
            toggleRecording(); // Stop recording first
        }

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }

        video.style.display = 'none';
        canvas.style.display = 'block';

        startCameraBtn.disabled = false;
        recordCameraBtn.disabled = true;
        stopCameraBtn.disabled = true;
        switchCameraBtn.disabled = true;

        stopPoseDetection();
    }

    // Switch camera
    async function switchCamera() {
        if (stream) {
            if (isRecording) toggleRecording();
            stopCamera();
            setTimeout(() => {
                startCamera();
            }, 500);
        }
    }

    // Toggle Recording
    function toggleRecording() {
        if (!stream) return;

        if (!isRecording) {
            // Start recording
            recordedChunks = [];
            try {
                // If detecting, the canvas holds the video + skeleton overhead, 
                // but capturing canvas stream requires canvas to be drawing constantly.
                // For simplicity, we record the raw video stream. 
                // If you wanted to record the skeleton overlay, you'd use `canvas.captureStream()` 
                // and ensure `detectPose()` continues running fast enough.

                // Let's capture the canvas if it's visible, otherwise the video
                const recordStream = isDetecting ? canvas.captureStream(30) : stream;

                mediaRecorder = new MediaRecorder(recordStream, { mimeType: 'video/webm' });

                mediaRecorder.ondataavailable = function (e) {
                    if (e.data.size > 0) {
                        recordedChunks.push(e.data);
                    }
                };

                mediaRecorder.onstop = function () {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');

                    document.body.appendChild(a);
                    a.style = 'display: none';
                    a.href = url;
                    a.download = `yoga-session-${new Date().getTime()}.webm`;
                    a.click();

                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        showNotification('Recording saved successfully', 'success');
                    }, 100);
                };

                mediaRecorder.start();
                isRecording = true;

                // Update UI
                recordCameraBtn.textContent = "Stop Recording";
                recordCameraBtn.classList.add('active');
                document.getElementById('recordingIndicator').style.display = 'flex';
                showNotification('Recording started', 'info');

            } catch (err) {
                console.error("Error starting recording:", err);
                showNotification('Failed to start recording', 'error');
            }
        } else {
            // Stop recording
            mediaRecorder.stop();
            isRecording = false;

            // Update UI
            recordCameraBtn.textContent = "Record";
            recordCameraBtn.classList.remove('active');
            document.getElementById('recordingIndicator').style.display = 'none';
        }
    }

    // Start pose detection
    function startPoseDetection() {
        if (isDetecting) return;

        isDetecting = true;
        canvas.style.display = 'block';
        video.style.display = 'none';

        // Simulate pose detection
        poseDetectionInterval = setInterval(() => {
            detectPose();
        }, 100);
    }

    // Stop pose detection
    function stopPoseDetection() {
        isDetecting = false;
        if (poseDetectionInterval) {
            clearInterval(poseDetectionInterval);
            poseDetectionInterval = null;
        }
    }

    // Simulate pose detection
    function detectPose() {
        if (!isDetecting) return;

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Simulate pose detection results
        const poses = [
            { name: 'Mountain Pose', sanskrit: 'Tadasana', confidence: 85, alignment: 82 },
            { name: 'Tree Pose', sanskrit: 'Vrksasana', confidence: 78, alignment: 75 },
            { name: 'Warrior I', sanskrit: 'Virabhadrasana I', confidence: 72, alignment: 68 },
            { name: 'Downward Dog', sanskrit: 'Adho Mukha Svanasana', confidence: 90, alignment: 88 }
        ];

        const currentPose = poses[Math.floor(Math.random() * poses.length)];

        // Update UI with detected pose
        updatePoseDetection(currentPose);

        // Draw skeleton if enabled
        if (showSkeletonCheckbox.checked) {
            drawSkeleton();
        }

        // Update session stats if session is active
        if (sessionActive) {
            updateSessionStats(currentPose);
        }
    }

    // Update pose detection UI
    function updatePoseDetection(pose) {
        // Update current asana
        document.getElementById('currentAsana').textContent = pose.name;
        document.getElementById('asanaSanskrit').textContent = pose.sanskrit;

        // Update confidence
        document.getElementById('confidenceFill').style.width = pose.confidence + '%';
        document.getElementById('confidenceValue').textContent = pose.confidence + '%';

        // Update alignment score
        document.getElementById('alignmentScore').textContent = pose.alignment;
        updateAlignmentGauge(pose.alignment);

        // Update pose indicator
        document.querySelector('.pose-status').textContent = pose.name;
        document.querySelector('.pose-confidence').textContent = `Confidence: ${pose.confidence}%`;

        // Update alerts
        updateAlerts(pose);

        // Voice guidance
        if (voiceGuidanceCheckbox.checked && Math.random() > 0.7) {
            provideVoiceGuidance(pose);
        }
    }

    // Draw skeleton overlay
    function drawSkeleton() {
        const skeletonOverlay = document.getElementById('skeletonOverlay');
        skeletonOverlay.style.display = 'block';

        // Simulate skeleton points (in real app, this would come from MediaPipe)
        const skeletonPoints = [
            { x: 320, y: 100 }, // Head
            { x: 320, y: 200 }, // Neck
            { x: 280, y: 250 }, // Left shoulder
            { x: 360, y: 250 }, // Right shoulder
            { x: 260, y: 350 }, // Left elbow
            { x: 380, y: 350 }, // Right elbow
            { x: 250, y: 450 }, // Left wrist
            { x: 390, y: 450 }, // Right wrist
            { x: 320, y: 300 }, // Hip center
            { x: 290, y: 400 }, // Left hip
            { x: 350, y: 400 }, // Right hip
            { x: 280, y: 480 }, // Left knee
            { x: 360, y: 480 }, // Right knee
            { x: 270, y: 580 }, // Left ankle
            { x: 370, y: 580 }  // Right ankle
        ];

        // Clear existing skeleton
        skeletonOverlay.innerHTML = '';

        // Draw skeleton lines
        const connections = [
            [0, 1], [1, 2], [1, 3], [2, 4], [4, 6], [3, 5], [5, 7],
            [1, 8], [8, 9], [8, 10], [9, 11], [11, 13], [10, 12], [12, 14]
        ];

        connections.forEach(([start, end]) => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', skeletonPoints[start].x);
            line.setAttribute('y1', skeletonPoints[start].y);
            line.setAttribute('x2', skeletonPoints[end].x);
            line.setAttribute('y2', skeletonPoints[end].y);
            line.setAttribute('class', 'skeleton-line');
            skeletonOverlay.appendChild(line);
        });

        // Draw skeleton points
        skeletonPoints.forEach(point => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);
            circle.setAttribute('r', 4);
            circle.setAttribute('class', 'skeleton-point');
            skeletonOverlay.appendChild(circle);
        });
    }

    // Update alignment gauge
    function updateAlignmentGauge(score) {
        const gauge = document.getElementById('scoreGauge');
        const circumference = 2 * Math.PI * 50;
        const offset = circumference - (score / 100) * circumference;
        gauge.style.strokeDashoffset = offset;
    }

    // Update alerts
    function updateAlerts(pose) {
        const alertsList = document.getElementById('alertsList');
        const alerts = [];

        if (pose.alignment > 80) {
            alerts.push({
                type: 'success',
                icon: '✓',
                text: 'Excellent posture alignment'
            });
        }

        if (pose.confidence < 80) {
            alerts.push({
                type: 'warning',
                icon: '⚠',
                text: 'Move into clearer pose position'
            });
        }

        if (pose.alignment < 75) {
            alerts.push({
                type: 'info',
                icon: '💡',
                text: 'Engage your core muscles'
            });
        }

        // Add random tips
        const tips = [
            { type: 'info', icon: '💡', text: 'Keep your spine straight' },
            { type: 'info', icon: '💡', text: 'Breathe deeply and steadily' },
            { type: 'info', icon: '💡', text: 'Relax your shoulders' }
        ];

        if (alerts.length < 3 && Math.random() > 0.5) {
            alerts.push(tips[Math.floor(Math.random() * tips.length)]);
        }

        // Update alerts UI
        alertsList.innerHTML = '';
        alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-item ${alert.type}`;
            alertDiv.innerHTML = `
                <span class="alert-icon">${alert.icon}</span>
                <span class="alert-text">${alert.text}</span>
            `;
            alertsList.appendChild(alertDiv);
        });
    }

    // Provide voice guidance
    function provideVoiceGuidance(pose) {
        if ('speechSynthesis' in window) {
            const messages = [
                `Great job in ${pose.name}`,
                'Keep breathing steadily',
                'Excellent alignment',
                'Hold this position',
                'Focus on your form'
            ];

            const message = messages[Math.floor(Math.random() * messages.length)];
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;

            speechSynthesis.speak(utterance);
        }
    }

    // Session management
    function startSession() {
        sessionActive = true;
        sessionStartTime = Date.now();
        sessionStats = {
            duration: 0,
            poseCount: 0,
            totalAlignment: 0,
            poses: []
        };

        startSessionBtn.disabled = true;
        pauseSessionBtn.disabled = false;
        endSessionBtn.disabled = false;

        // Start session timer
        sessionTimer = setInterval(updateSessionTimer, 1000);

        showNotification('Session started', 'success');
    }

    function pauseSession() {
        if (sessionActive) {
            sessionActive = false;
            clearInterval(sessionTimer);

            startSessionBtn.disabled = false;
            startSessionBtn.textContent = 'Resume Session';
            pauseSessionBtn.disabled = true;

            showNotification('Session paused', 'info');
        }
    }

    function endSession() {
        sessionActive = false;
        clearInterval(sessionTimer);

        startSessionBtn.disabled = false;
        startSessionBtn.textContent = 'Start Session';
        pauseSessionBtn.disabled = true;
        endSessionBtn.disabled = true;

        // Show session summary
        showSessionSummary();

        showNotification('Session ended', 'success');
    }

    // Update session timer
    function updateSessionTimer() {
        if (!sessionActive) return;

        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        document.getElementById('sessionTime').textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        sessionStats.duration = elapsed;
    }

    // Update session statistics
    function updateSessionStats(pose) {
        if (!sessionActive) return;

        sessionStats.poseCount++;
        sessionStats.totalAlignment += pose.alignment;

        if (!sessionStats.poses.find(p => p.name === pose.name)) {
            sessionStats.poses.push(pose);
        }

        // Update UI
        document.getElementById('poseCount').textContent = sessionStats.poseCount;

        const avgAlignment = Math.round(sessionStats.totalAlignment / sessionStats.poseCount);
        document.getElementById('avgAlignment').textContent = avgAlignment;
    }

    // Show session summary
    function showSessionSummary() {
        const avgAlignment = sessionStats.poseCount > 0 ?
            Math.round(sessionStats.totalAlignment / sessionStats.poseCount) : 0;

        const summary = `
            Session Summary:
            Duration: ${document.getElementById('sessionTime').textContent}
            Poses: ${sessionStats.poseCount}
            Average Alignment: ${avgAlignment}%
            Unique Poses: ${sessionStats.poses.length}
        `;

        showNotification(summary, 'info', 5000);
    }

    // Show notification
    function showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'error' ? 'var(--dosha-pitta)' : type === 'success' ? 'var(--dosha-kapha)' : 'var(--dosha-vata)'};
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 0px;
            font-family: var(--font-mono);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            z-index: 10000;
            animation: slideIn 0.3s ease;
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

    // Pose card interactions
    const poseCards = document.querySelectorAll('.pose-card');
    poseCards.forEach(card => {
        card.addEventListener('click', function () {
            const poseName = this.querySelector('.pose-name').textContent;
            const poseSanskrit = this.querySelector('.pose-sanskrit').textContent;

            // Update current pose display
            document.getElementById('currentAsana').textContent = poseName;
            document.getElementById('asanaSanskrit').textContent = poseSanskrit;

            // Show notification
            showNotification(`Selected: ${poseName}`, 'info');
        });
    });

    // Initialize alignment gauge
    updateAlignmentGauge(82);

    console.log('Yoga Posture AI initialized successfully');
});

// Yoga-specific utility functions
const YogaAI = {
    // Calculate pose difficulty based on user performance
    calculatePoseDifficulty: (alignment, confidence) => {
        const score = (alignment + confidence) / 2;
        if (score >= 85) return 'Beginner';
        if (score >= 70) return 'Intermediate';
        return 'Advanced';
    },

    // Get personalized recommendations
    getRecommendations: (sessionStats) => {
        const recommendations = [];

        if (sessionStats.avgAlignment < 75) {
            recommendations.push('Focus on basic poses to improve alignment');
        }

        if (sessionStats.duration < 300) { // Less than 5 minutes
            recommendations.push('Try longer sessions for better results');
        }

        if (sessionStats.poseCount < 5) {
            recommendations.push('Practice more variety of poses');
        }

        return recommendations;
    }
};
