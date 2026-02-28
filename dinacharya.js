// c:\Users\ARNAV VERMA\Pictures\hack\dtu\dinacharya.js
document.addEventListener('DOMContentLoaded', function () {

    // 1. Clock Logic
    const timeDisplay = document.querySelector('.current-time-display');
    const doshaDisplay = document.querySelector('.current-dosha-period');

    function updateDoshaClock() {
        if (!timeDisplay || !doshaDisplay) return;

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        timeDisplay.textContent = `${hours}:${minutes}`;

        const h = now.getHours();
        let dosha = "";

        // Ayurvedic Dosha Clock
        // 2am - 6am : Vata
        // 6am - 10am : Kapha
        // 10am - 2pm : Pitta
        // 2pm - 6pm : Vata
        // 6pm - 10pm : Kapha
        // 10pm - 2am : Pitta

        if (h >= 2 && h < 6) dosha = "Vata (Creation & Evacuation)";
        else if (h >= 6 && h < 10) dosha = "Kapha (Strength & Stability)";
        else if (h >= 10 && h < 14) dosha = "Pitta (Digestion & Intellect)";
        else if (h >= 14 && h < 18) dosha = "Vata (Communication & Flow)";
        else if (h >= 18 && h < 22) dosha = "Kapha (Relaxation & Grounding)";
        else dosha = "Pitta (Cellular Repair)";

        doshaDisplay.textContent = dosha;
    }

    setInterval(updateDoshaClock, 1000);
    updateDoshaClock();

    // 2. Checklist Logic
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.routine-progress span');

    function updateProgress() {
        const total = checkboxes.length;
        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;

        const percentage = (checked / total) * 100;

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${checked} / ${total} Completed`;
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', function () {
            const listItem = this.closest('.task-item');
            if (this.checked) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed');
            }
            updateProgress();
        });
    });

    // Initial progress sync based on HTML state
    updateProgress();
});
