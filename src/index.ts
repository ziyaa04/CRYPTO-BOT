import * as dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV,
});
import bot from './bot';
import * as mongoose from 'mongoose';
import CommandController from './controllers/command.controller';
import CommandService from './services/command.service';
import apiAdaptersGenerator from './adapters/all.adapter';
import { Context } from 'telegraf';
import MessageService from './services/message.service';
import { Logger } from 'tslog';
import { Users } from './db/tables.db';

// create singletons
// apiAdaptersGenerator creates array of adapters
const logger = new Logger();
const messageService = new MessageService();
const commandService = new CommandService(
  messageService,
  logger,
  apiAdaptersGenerator(),
);
const commandController = new CommandController(commandService);

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
bot.command('price', (ctx: Context) => commandController.PriceCommand(ctx));
bot.command('exchanges', (ctx: Context) =>
  commandController.ExchangesCommand(ctx),
);

bot.command('my_exchanges', (ctx: Context) =>
  commandController.MyExchangesCommand(ctx),
);

// actions
bot.action(/exchange-set-[a-zA-Z_]+/, (ctx: Context) =>
  commandController.SetExchangeAction(ctx),
);
bot.action(/exchange-remove-[a-zA-Z_]+/, (ctx: Context) =>
  commandController.RemoveExchangeAction(ctx),
);

// start application
const start = async () => {
  await mongoose.connect(process.env.DB_STRING, async () => {
    bot.launch();
    console.log('APP STARTED!');
  });
};
start();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
