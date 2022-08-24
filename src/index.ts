import * as dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV,
});
import bot from './bot';
import * as mongoose from 'mongoose';
import CommandController from './controllers/command.controller';
import CommandService from './services/command.service';
import apiAdaptersGenerator from './adapters/all.adapter';

// create  instances
// apiAdaptersGenerator creates array of adapters
const commandService = new CommandService(apiAdaptersGenerator());
const commandController = new CommandController(commandService);
// middlewares

// commands
bot.command('price', commandController.Price);
bot.command('exchanges', commandController.Exchanges);
bot.command('my_exchanges', commandController.MyExchanges);

// start application
const start = async () => {
  await mongoose.connect(process.env.DB_STRING, async () => {
    bot.launch();
    console.log('APP STARTED!');
  });
};
start();
