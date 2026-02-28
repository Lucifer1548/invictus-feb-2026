// c:\Users\ARNAV VERMA\Pictures\hack\dtu\chitta.js
document.addEventListener('DOMContentLoaded', function () {

    // 1. Mood Selection Logic
    const moodBtns = document.querySelectorAll('.mood-btn');
    let selectedMood = null;

    moodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove selected class from all
            moodBtns.forEach(b => b.classList.remove('selected'));

            // Add to clicked
            e.target.classList.add('selected');
            selectedMood = e.target.getAttribute('data-mood');
        });
    });

    // 2. Save Mood Logic
    const saveBtn = document.querySelector('.save-mood-btn');
    const noteInput = document.querySelector('.mood-note');
    const historyList = document.querySelector('.mood-history-list');

    saveBtn.addEventListener('click', () => {
        if (!selectedMood) {
            alert("Please select a mood first.");
            return;
        }

        const noteText = noteInput.value.trim();
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Get matching button text and class for styling
        const selectedBtn = document.querySelector(`.mood-btn[data-mood="${selectedMood}"]`);
        const moodText = selectedBtn.textContent;
        // extract dosha class
        let doshaClass = "";
        if (selectedBtn.classList.contains('vata')) doshaClass = "vata";
        else if (selectedBtn.classList.contains('pitta')) doshaClass = "pitta";
        else if (selectedBtn.classList.contains('kapha')) doshaClass = "kapha";
        else if (selectedBtn.classList.contains('sattva')) doshaClass = "sattva";

        // Create new history item
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="time">Today, ${timeString}</span>
            <span class="mood ${doshaClass}">${moodText}</span>
            <span class="note">${noteText || "No note added."}</span>
        `;

        // Add to top of list
        historyList.prepend(li);

        // Reset form
        moodBtns.forEach(b => b.classList.remove('selected'));
        selectedMood = null;
        noteInput.value = "";

        // Optional: show a quick confirmation or disable button briefly
        saveBtn.textContent = "Saved ✓";
        setTimeout(() => saveBtn.textContent = "Log State", 2000);
    });

    // 3. Burnout Chart Logic (Canvas)
    function createChittaBurnoutChart() {
        const canvas = document.getElementById('chittaBurnoutChart');
        if (!canvas) return;

        // Setup high resolution canvas
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);

        const width = rect.width;
        const height = rect.height;
        const padding = 30;

        ctx.clearRect(0, 0, width, height);

        // Chart styling
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
            ctx.fillText((100 - i * 20).toString(), 5, y + 3);
        }

        // Extended 14 day data mockup
        const data = [30, 35, 42, 40, 50, 60, 55, 65, 72, 68, 80, 75, 82, 78];
        const stepX = (width - 2 * padding) / (data.length - 1);

        // Draw line
        ctx.strokeStyle = '#d4a853'; // accent gold
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((value, index) => {
            const x = padding + index * stepX;
            const y = padding + (height - 2 * padding) * (1 - value / 100);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw area under curve
        ctx.lineTo(padding + (data.length - 1) * stepX, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(212, 168, 83, 0.4)');
        gradient.addColorStop(1, 'rgba(212, 168, 83, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw points
        ctx.fillStyle = '#d4a853';
        data.forEach((value, index) => {
            const x = padding + index * stepX;
            const y = padding + (height - 2 * padding) * (1 - value / 100);
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });

        // X-axis labels (days ago)
        ctx.fillStyle = '#888';
        ctx.fillText("14 Days Ago", padding, height - 10);
        ctx.fillText("Today", width - padding - 25, height - 10);
    }

    setTimeout(createChittaBurnoutChart, 300);

    window.addEventListener('resize', () => {
        setTimeout(createChittaBurnoutChart, 50);
    });
});
