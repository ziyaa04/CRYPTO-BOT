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

// middlewares
bot.use(async (ctx: Context, next) => {
  let user = cache.find(
    (user: IUser) => user.telegram_id === ctx.message.from.id,
  );
  if (!user) {
    const ctxFrom = ctx.message.from;
    user = await UserSchema.create({
      telegram_id: ctxFrom.id,
      telegram_name: ctxFrom.username,
      telegram_lang: ctxFrom.language_code,
      exchanges: [],
    });
    cache.push(user);
  }
  ctx['user'] = user;
  next();
});

// commands
bot.command('price', (ctx: Context) => commandController.Price(ctx));
bot.command('exchanges', (ctx: Context) => commandController.Exchanges(ctx));
bot.command('my_exchanges', (ctx: Context) =>
  commandController.MyExchanges(ctx),
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
