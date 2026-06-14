const weddingDate = new Date('2026-07-30T13:00:00+03:00');

const EMAILJS_SERVICE_ID = 'service_fnulpu6';
const EMAILJS_TEMPLATE_ID = 'template_lfo7szt';
const EMAILJS_PUBLIC_KEY = 'z4_r9dONrxMC-2th7';

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<div class="celebration">Сегодня наш день!</div>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}

function setupMusic() {
  const music = document.getElementById('weddingMusic');
  const toggle = document.getElementById('musicToggle');
  const intro = document.getElementById('introScreen');
  const openButton = document.getElementById('openInvitation');
  if (!music || !toggle) return;

  music.volume = 0.45;

  async function playMusic() {
    await music.play();
    toggle.textContent = '♫ Остановить музыку';
    toggle.classList.add('is-playing');
  }

  if (openButton && intro) {
    openButton.addEventListener('click', async () => {
      intro.classList.add('is-hidden');
      document.body.classList.remove('is-locked');

      try {
        await playMusic();
      } catch (error) {
        toggle.textContent = '♫ Включить музыку';
        toggle.classList.remove('is-playing');
      }
    });
  }

  toggle.addEventListener('click', async () => {
    try {
      if (music.paused) {
        await playMusic();
      } else {
        music.pause();
        toggle.textContent = '♫ Включить музыку';
        toggle.classList.remove('is-playing');
      }
    } catch (error) {
      toggle.textContent = 'Нажмите ещё раз для музыки';
    }
  });
}

function setupEmailJS() {
  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form = document.getElementById('rsvpForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('guestName').value.trim();
    const answer = document.getElementById('guestAnswer').value;
    const comment = document.getElementById('guestComment').value.trim();
    const button = form.querySelector('button[type="submit"]');

    if (!window.emailjs) {
      status.textContent = 'Ошибка: EmailJS не загрузился. Проверьте подключение к интернету.';
      status.className = 'form-status error';
      return;
    }

    const templateParams = {
      guest_name: name,
      guest_answer: answer,
      guest_comment: comment || 'Без комментария',
      wedding_date: '30.07.2026',
      reply_deadline: '21.06.2026',
      event_name: 'Свадьба Артёма и Екатерины'
    };

    try {
      button.disabled = true;
      button.textContent = 'Отправляем...';
      status.textContent = '';
      status.className = 'form-status';

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      status.textContent = 'Спасибо! Ваш ответ отправлен.';
      status.className = 'form-status success';
      form.reset();
    } catch (error) {
      status.textContent = 'Не удалось отправить ответ. Попробуйте ещё раз или сообщите молодожёнам лично.';
      status.className = 'form-status error';
      console.error('EmailJS error:', error);
    } finally {
      button.disabled = false;
      button.textContent = 'Отправить ответ';
    }
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);
setupMusic();
setupEmailJS();
