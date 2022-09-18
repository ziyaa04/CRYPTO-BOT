import { config } from 'dotenv';
config({
  path: process.env.NODE_ENV,
});
import bot from './bot';
import * as mongoose from 'mongoose';

// start application
const start = async () => {
  bot.launch();
  console.log('APP STARTED!');
};
start();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
