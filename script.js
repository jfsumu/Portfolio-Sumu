// Navbar navigation
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('article[data-page]');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const target = link.textContent.trim().toLowerCase();

    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    pages.forEach(page => {
      if (page.dataset.page === target) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });
  });
});

// Contact form enable/disable send button
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const messageInput = document.getElementById('message-input');
const formBtn = document.getElementById('form-btn');

function checkForm() {
  const filled = nameInput.value.trim() && emailInput.value.trim() && messageInput.value.trim();
  formBtn.disabled = !filled;
}

[nameInput, emailInput, messageInput].forEach(el => el.addEventListener('input', checkForm));

// Send button opens the visitor's mail client with the message pre-filled
formBtn.addEventListener('click', () => {
  const subject = encodeURIComponent(`Portfolio message from ${nameInput.value.trim()}`);
  const body = encodeURIComponent(`${messageInput.value.trim()}\n\n— ${nameInput.value.trim()} (${emailInput.value.trim()})`);
  window.location.href = `mailto:jfssumu@gmail.com?subject=${subject}&body=${body}`;
});
