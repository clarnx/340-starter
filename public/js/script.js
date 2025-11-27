document.addEventListener('DOMContentLoaded', function() {
  const togglePasswordBtn = document.getElementById('togglePassword');

  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', function() {
      const passwordInput = document.getElementById('account_password');

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordBtn.textContent = 'Hide Password';
        togglePasswordBtn.setAttribute('aria-label', 'Hide password');
      } else {
        passwordInput.type = 'password';
        togglePasswordBtn.textContent = 'Show Password';
        togglePasswordBtn.setAttribute('aria-label', 'Show password as text');
      }
    });
  }
});
