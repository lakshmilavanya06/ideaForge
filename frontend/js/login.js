
    // Create particles
    function createParticles() {
      const particlesContainer = document.querySelector('.particles');
      const particleCount = window.innerWidth < 768 ? 30 : 50;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 10 + 5;
        const posX = Math.random() * window.innerWidth;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.bottom = `-${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
      }
    }

    // Domain selection limit
    function setupDomainSelection() {
      const checkboxes = document.querySelectorAll('.domain-option input');
      const maxSelections = 3;
      
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const checkedCount = document.querySelectorAll('.domain-option input:checked').length;
          
          if (checkedCount > maxSelections) {
            this.checked = false;
            alert(`You can select up to ${maxSelections} domains only.`);
          }
        });
      });
    }

    // Form validation
    function setupFormValidation() {
      const form = document.querySelector('form');
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email && password) {
          // Add your login logic here
          alert('Login successful! Redirecting...');
          // window.location.href = 'dashboard.html';
        } else {
          alert('Please fill in all required fields');
        }
      });
    }

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
      createParticles();
      setupDomainSelection();
      setupFormValidation();
      
      // Handle window resize
      window.addEventListener('resize', function() {
        document.querySelector('.particles').innerHTML = '';
        createParticles();
      });
    });
  