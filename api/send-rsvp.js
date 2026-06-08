export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).send('Telegram env vars are not configured');
  }

  const data = req.body;

  const text = `💌 RSVP на свадьбу Романа и Анны

Имя: ${data.name || '-'}
Присутствие: ${data.attendance || '-'}
Гость: ${data.guest || '-'}
Алкоголь: ${(data.alcohol || []).join(', ') || '-'}
Комментарий: ${data.comment || '-'}`;

  const chatIds = TELEGRAM_CHAT_ID
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  const results = await Promise.all(
    chatIds.map(chatId =>
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text
        })
      })
    )
  );

  const hasError = results.some(response => !response.ok);

  if (hasError) {
    return res.status(500).send('Telegram error');
  }

  return res.status(200).send('ok');
}
