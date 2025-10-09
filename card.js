document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.getElementById('contactBtn');
    const contactForm = document.getElementById('contactForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const messageForm = document.getElementById('messageForm');

    contactBtn.addEventListener('click', () => {
        contactForm.classList.add('active');
    });

    cancelBtn.addEventListener('click', () => {
        contactForm.classList.remove('active');
        messageForm.reset();
    });

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;

        alert(`Thanks, ${name}! Your message about "${subject}" has been sent. We'll reach out at ${email}.`);
        messageForm.reset();
        contactForm.classList.remove('active');
    });
});
