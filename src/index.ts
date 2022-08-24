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
import UserSchema, { IUser } from './schemas/user.schema';

// make cache variable
let cache: IUser[] = [];

// create singletons
// apiAdaptersGenerator creates array of adapters
const commandService = new CommandService(apiAdaptersGenerator());
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
bot.action(/exchange-set-[a-z]+/, (ctx: Context) =>
  commandController.SetExchangeAction(ctx),
);

// start application
const start = async () => {
  await mongoose.connect(process.env.DB_STRING, async () => {
    bot.launch();
    cache = await UserSchema.find();
    console.log('APP STARTED!');
  });
};
start();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
