
    // DOM Elements
    const darkToggle = document.getElementById('darkToggle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const backToTop = document.getElementById('backToTop');
    
    // Dark Mode Toggle
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      
      // Update icon
      const icon = darkToggle.querySelector('i');
      if (document.body.classList.contains('dark')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('darkMode', 'enabled');
      } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('darkMode', 'disabled');
      }
    });
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark');
      darkToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
    
    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          !sidebar.contains(e.target) && 
          e.target !== menuToggle) {
        sidebar.classList.remove('active');
      }
    });
    
    // Back to Top Button
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Close sidebar on mobile after navigation
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
          }
        }
      });
    });

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

    window.addEventListener('load', createParticles);
    window.addEventListener('resize', () => {
      document.querySelector('.particles').innerHTML = '';
      createParticles();
    });

    // Parallax effect for hero image
    window.addEventListener('scroll', () => {
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        const scrollPosition = window.pageYOffset;
        heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
      }
    });
  