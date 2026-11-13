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

// Contact form
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const messageInput = document.getElementById('message-input');
const formBtn = document.getElementById('form-btn');
const btnText = formBtn.querySelector('span');

// Status message shown under the button (created here, no HTML change needed)
const statusMsg = document.createElement('p');
statusMsg.style.marginTop = '12px';
statusMsg.style.fontSize = '14px';
formBtn.insertAdjacentElement('afterend', statusMsg);

function checkForm() {
  const filled = nameInput.value.trim() && emailInput.value.trim() && messageInput.value.trim();
  formBtn.disabled = !(filled && emailInput.checkValidity());
}

[nameInput, emailInput, messageInput].forEach(el => el.addEventListener('input', checkForm));

// Send the message through FormSubmit; it forwards it to your Gmail
formBtn.addEventListener('click', async () => {
  const originalText = btnText.textContent;
  formBtn.disabled = true;
  btnText.textContent = 'Sending...';
  statusMsg.textContent = '';

  try {
    const response = await fetch('https://formsubmit.co/ajax/jfssumu@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        _subject: `Portfolio message from ${nameInput.value.trim()}`,
        _replyto: emailInput.value.trim(),
        _template: 'table',
        _captcha: 'false'
      })
    });

    const data = await response.json();

    if (response.ok && (data.success === 'true' || data.success === true)) {
      statusMsg.textContent = 'Thank you! Your message has been sent.';
      statusMsg.style.color = '#4ade80';
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';
      btnText.textContent = originalText;
      checkForm();
    } else {
      throw new Error(data.message || 'Request failed');
    }
  } catch (err) {
    // Fallback: open the visitor's mail app if the request fails
    statusMsg.textContent = 'Could not send directly, opening your mail app instead...';
    statusMsg.style.color = '#f87171';
    const subject = encodeURIComponent(`Portfolio message from ${nameInput.value.trim()}`);
    const body = encodeURIComponent(`${messageInput.value.trim()}\n\n— ${nameInput.value.trim()} (${emailInput.value.trim()})`);
    window.location.href = `mailto:jfssumu@gmail.com?subject=${subject}&body=${body}`;
    btnText.textContent = originalText;
    formBtn.disabled = false;
  }
});