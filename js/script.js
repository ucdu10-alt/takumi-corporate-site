(() => {
  'use strict';

  // Loader
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => loader.classList.add('done'), 500);
    }
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header scroll state
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mainNav.classList.remove('open');
      });
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Contact form (submits via Web3Forms — no server of our own required)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中…';
      formStatus.className = 'form-status show';
      formStatus.textContent = '';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          formStatus.className = 'form-status show success';
          formStatus.textContent = 'お問い合わせを受け付けました。担当より折り返しご連絡いたします。';
          contactForm.reset();
        } else {
          throw new Error(result.message || '送信に失敗しました');
        }
      } catch (error) {
        formStatus.className = 'form-status show error';
        formStatus.textContent = '送信に失敗しました。恐れ入りますがお電話にてご連絡いただくか、時間をおいて再度お試しください。';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '送信する';
      }
    });
  }

})();
