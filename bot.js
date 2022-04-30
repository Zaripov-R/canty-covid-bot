require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const M = require('telegraf-markup4');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `
Привет, ${ctx.message.from.first_name}!
Узнай статистику по Коронавирусу.
Введи на английском название страны и получи статистику.
Посмотреть весь список стран можно командой /help.
`,
    M.keyboard.reply([
      ['US', 'Russia'],
      ['Ukraine', 'Belarus'],
    ])
  )
);
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
        `;
    ctx.reply(formData);
  } catch (error) {
    ctx.reply('Ошибка, такой страны не существует, посмотрите /help.');
  }
});
bot.launch();
