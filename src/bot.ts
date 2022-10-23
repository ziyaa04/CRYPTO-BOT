import { Context, Telegraf } from 'telegraf';
import { Users } from './db/tables.db';
import { commandController, actionController } from './singletons';
const bot = new Telegraf(process.env.TOKEN);

// add user to the db
bot.use((ctx: Context, next) => {
  if (!Users.findOne({ telegram_id: ctx.from.id })) {
    Users.add({
      telegram_id: ctx.from.id,
      telegram_name: ctx.from.username ?? 'unknown',
      user_name: ctx.from.first_name ?? 'unknown',
      user_lastname: ctx.from.last_name ?? 'unknown',
      telegram_lang: ctx.from.language_code,
      is_bot: ctx.from.is_bot,
      exchanges: [],
    });

    Users.save();
  }
  next();
});

// bot start
bot.start((ctx: Context) => commandController.Start(ctx));

// commands
bot.command('max_price', (ctx: Context) => commandController.MaxPrice(ctx));
bot.command('min_price', (ctx: Context) => commandController.MinPrice(ctx));
bot.command('price', (ctx: Context) => commandController.Price(ctx));
bot.command('exchanges', (ctx: Context) => commandController.Exchanges(ctx));
bot.command('my_exchanges', (ctx: Context) =>
  commandController.MyExchanges(ctx),
);

// actions
bot.action(/exchange-set-[a-zA-Z_]+/, (ctx: Context) =>
  actionController.SetExchange(ctx),
);
bot.action(/exchange-remove-[a-zA-Z_]+/, (ctx: Context) =>
  actionController.RemoveExchange(ctx),
);

export default bot;
