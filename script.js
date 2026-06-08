const weddingDate = new Date('2026-08-28T17:00:00+05:00');

function tick() {
  const diff = Math.max(0, weddingDate - new Date());
  const s = Math.floor(diff / 1000);

  days.textContent = Math.floor(s / 86400);
  hours.textContent = Math.floor((s % 86400) / 3600);
  minutes.textContent = Math.floor((s % 3600) / 60);
  seconds.textContent = s % 60;
}

tick();
setInterval(tick, 1000);

const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  }),
  { threshold: .15 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const modal = document.getElementById('rsvpModal');
const rsvpForm = document.getElementById('rsvpForm');
const formStatus = document.getElementById('formStatus');
const heartGame = document.getElementById('heartGame');

document.querySelectorAll('[data-open-rsvp]').forEach(button => {
  button.onclick = () => modal.showModal();
});

document.querySelector('[data-close-rsvp]').onclick = () => modal.close();

rsvpForm.addEventListener('submit', async event => {
  event.preventDefault();

  formStatus.textContent = 'Отправляем...';

  const data = new FormData(rsvpForm);
  const alcohol = data.getAll('alcohol');
  const payload = Object.fromEntries(data.entries());

  payload.alcohol = alcohol;

  try {
    const res = await fetch('/api/send-rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error('Request failed');
    }

    formStatus.textContent = 'Спасибо! Ответ отправлен 💌';

    setTimeout(() => {
      modal.close();
    }, 1200);

    rsvpForm.reset();
  } catch {
    formStatus.textContent = 'Не удалось отправить. Проверьте настройки Telegram.';
  }
});

let score = 0;

heartGame.onclick = () => {
  score = 0;
  document.getElementById('score').textContent = 0;
  spawnHeart();
};

function spawnHeart() {
  if (score >= 5) return;

  const heart = document.createElement('button');

  heart.className = 'heart';
  heart.textContent = '♡';
  heart.style.left = Math.random() * 80 + 10 + 'vw';
  heart.style.top = Math.random() * 70 + 12 + 'vh';

  heart.onclick = () => {
    score++;
    document.getElementById('score').textContent = score;
    heart.remove();

    if (score < 5) {
      spawnHeart();
    } else {
      setTimeout(() => {
        alert('Спасибо за любовь! До встречи на свадьбе 🤍');
      }, 150);
    }
  };

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 2600);
}
