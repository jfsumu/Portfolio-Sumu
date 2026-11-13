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

// ---------- Email helpers ----------
const MY_EMAIL = 'jfssumu@gmail.com';

function gmailComposeUrl(subject = '', body = '') {
  return 'https://mail.google.com/mail/?view=cm&fs=1'
    + '&to=' + encodeURIComponent(MY_EMAIL)
    + (subject ? '&su=' + encodeURIComponent(subject) : '')
    + (body ? '&body=' + encodeURIComponent(body) : '');
}

// On desktop, open Gmail compose instead of the broken default mail app.
// On phones, normal mailto: links keep working.
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      window.open(gmailComposeUrl(), '_blank', 'noopener');
    });
  });
}

// ---------- Contact form ----------
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const messageInput = document.getElementById('message-input');
const formBtn = document.getElementById('form-btn');
const btnText = formBtn.querySelector('span');

// Status message under the button (created here, no HTML change needed)
const statusMsg = document.createElement('p');
statusMsg.style.marginTop = '12px';
statusMsg.style.fontSize = '14px';
formBtn.insertAdjacentElement('afterend', statusMsg);

function checkForm() {
  const filled = nameInput.value.trim() && emailInput.value.trim() && messageInput.value.trim();
  formBtn.disabled = !(filled && emailInput.checkValidity());
}

[nameInput, emailInput, messageInput].forEach(el => el.addEventListener('input', checkForm));

formBtn.addEventListener('click', async () => {
  const originalText = btnText.textContent;
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  formBtn.disabled = true;
  btnText.textContent = 'Sending...';
  statusMsg.textContent = '';

  try {
    const response = await fetch('https://formsubmit.co/ajax/' + MY_EMAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Portfolio message from ${name}`,
        _replyto: email,
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
    } else {
      throw new Error(data.message || 'Request failed');
    }
  } catch (err) {
    // Fallback: open Gmail compose with the message pre-filled
    statusMsg.textContent = 'Could not send directly. Opening Gmail with your message instead...';
    statusMsg.style.color = '#f87171';
    const body = `${message}\n\n— ${name} (${email})`;
    window.open(gmailComposeUrl(`Portfolio message from ${name}`, body), '_blank', 'noopener');
  }

  btnText.textContent = originalText;
  checkForm();
});