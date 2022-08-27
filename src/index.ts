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

// create singletons
// apiAdaptersGenerator creates array of adapters
const messageService = new MessageService();
const commandService = new CommandService(
  messageService,
  apiAdaptersGenerator(),
);
const commandController = new CommandController(commandService);

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
