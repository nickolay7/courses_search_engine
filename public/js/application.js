// const TOKEN = '5006117405:AAHC5R8y0cE2h2uNEiUkTsOjTD_BiH7FkdY';
// const BASE_URL = `https://api.telegram.org/bot${TOKEN}/`
// const getMe = `${BASE_URL}getMe`;
// const sendMessage = `${BASE_URL}sendMessage?chat_id=1447651842&text=Hello Fedya!`;
// const getUpdates = `${BASE_URL}getUpdates`; // ?offset='update_id' начиная с которого присылать сообщения, остальные телега метит как прочитаные
//   // limit=2 ограничение количества ответов
// fetch(sendMessage)
//   .then((response) => response.json())
//   .then((data) => console.dir(data));
const smokeText = document.querySelector('.smoke');
if (smokeText) {
  setTimeout(() => smokeText.remove(), 5000);
}

