// ---------- Navbar navigation ----------
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('article[data-page]');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const target = link.textContent.trim().toLowerCase();

    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    pages.forEach(page => {
      page.classList.toggle('active', page.dataset.page === target);
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

// Opens Gmail compose in a new tab; if the popup is blocked, use the current tab.
function openGmail(subject, body) {
  const url = gmailComposeUrl(subject, body);
  const win = window.open(url, '_blank', 'noopener');
  if (!win) window.location.href = url;
}

// On desktop, email links open Gmail compose instead of the default mail app
// (which is often missing or broken). On phones, normal mailto: links are kept.
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-email-link]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      openGmail();
    });
  });
}

// ---------- Contact form ----------
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const messageInput = document.getElementById('message-input');
const formBtn = document.getElementById('form-btn');
const btnText = formBtn.querySelector('span');
const statusMsg = document.getElementById('form-status');

function setStatus(text, color) {
  statusMsg.textContent = text;
  statusMsg.style.color = color || '';
}

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
  const fallbackSubject = `Portfolio message from ${name}`;
  const fallbackBody = `${message}\n\n— ${name} (${email})`;

  // FormSubmit cannot work when the page is opened directly from disk (file://)
  if (window.location.protocol === 'file:') {
    setStatus('Opening Gmail with your message (direct sending needs the site to be online)...', '#f87171');
    openGmail(fallbackSubject, fallbackBody);
    return;
  }

  formBtn.disabled = true;
  btnText.textContent = 'Sending...';
  setStatus('');

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
        _subject: fallbackSubject,
        _replyto: email,
        _template: 'table',
        _captcha: 'false',
        _honey: ''
      })
    });

    const data = await response.json();

    if (response.ok && (data.success === 'true' || data.success === true)) {
      setStatus('Thank you! Your message has been sent.', '#4ade80');
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';
    } else {
      throw new Error(data.message || 'Request failed');
    }
  } catch (err) {
    // Fallback: open Gmail compose with the message pre-filled
    setStatus('Could not send directly. Opening Gmail with your message instead...', '#f87171');
    openGmail(fallbackSubject, fallbackBody);
  }

  btnText.textContent = originalText;
  checkForm();
});