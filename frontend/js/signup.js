
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (name && email && password) {
      // Add loading animation
      const button = document.querySelector('button[type="submit"]');
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      button.disabled = true;

      // Simulate API call
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      alert("Please fill in all fields.");
    }
  });

  // Password toggle functionality
  const togglePassword = document.getElementById('togglePassword');
  const password = document.getElementById('password');

  togglePassword.addEventListener('click', function() {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });
