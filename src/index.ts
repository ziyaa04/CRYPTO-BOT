import dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV,
});
import bot from './bot';
import * as mongoose from 'mongoose';

const start = async () => {
  mongoose.connect(process.env.DB_STRING, () => {
    bot.launch();
    console.log('APP STARTED!');
  });
};

start();
