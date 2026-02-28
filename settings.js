// c:\Users\ARNAV VERMA\Pictures\hack\dtu\settings.js
document.addEventListener('DOMContentLoaded', function () {

    // Tab switching logic
    const navItems = document.querySelectorAll('.settings-nav li');
    const sections = document.querySelectorAll('.settings-section');

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remove active from all tabs
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active to clicked tab
            this.classList.add('active');

            // Hide all sections
            sections.forEach(sec => sec.classList.remove('active'));

            // Show target section
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Save button visual feedback
    const saveBtn = document.querySelector('.save-settings-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            const originalText = this.textContent;
            this.textContent = "Saved ✓";
            this.style.background = "#2ea043"; // Success green
            this.style.color = "#fff";
            this.style.borderColor = "#2ea043";

            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = "";
                this.style.color = "";
                this.style.borderColor = "";
            }, 2000);
        });
    }

});
