// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.getElementById('contactBtn');
    const contactForm = document.getElementById('contactForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const messageForm = document.getElementById('messageForm');
    
     //Show contact form when contact button is clicked
    contactBtn.addEventListener('click', function() {
        contactForm.classList.add('active');
    });
    
     Hide contact form when cancel button is clicked
    cancelBtn.addEventListener('click', function() {
        contactForm.classList.remove('active');
        messageForm.reset();
    });
    
     Handle form submission
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
         Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
         Here you would typically send the data to a server
         For this example, we'll just show an alert and reset the form
        alert(`Thank you, ${name}! Your message has been sent.\n\nWe'll respond to ${email} regarding "${subject}" as soon as possible.`);
        
        // Reset form and hide it
        messageForm.reset();
        contactForm.classList.remove('active');
    });
    
    // Add hover effect to skills
    const skills = document.querySelectorAll('.skill');
    skills.forEach(skill => {
        skill.addEventListener('mouseover', function() {
            this.style.background = 'linear-gradient(45deg, #ff0080, #00ffcc)';
        });
        
        skill.addEventListener('mouseout', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });

});
