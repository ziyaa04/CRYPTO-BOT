import { Context, Telegraf } from 'telegraf';
import { config } from 'dotenv';
config({
  path: process.env.NODE_ENV,
});

const bot = new Telegraf(process.env.TOKEN);

const updateMessage = 'We are updating crypto-bot. Please try again later!';

bot.start((ctx: Context) => ctx.reply(updateMessage));

// commands
bot.command('price', (ctx: Context) => ctx.reply(updateMessage));
bot.command('exchanges', (ctx: Context) => ctx.reply(updateMessage));
bot.command('my_exchanges', (ctx: Context) => ctx.reply(updateMessage));

// actions
bot.action(/exchange-set-[a-zA-Z_]+/, (ctx: Context) =>
  ctx.reply(updateMessage),
);
bot.action(/exchange-remove-[a-zA-Z_]+/, (ctx: Context) =>
  ctx.reply(updateMessage),
);

const start = async () => {
  bot.launch();
  console.log('APP started!');
};
start();
