import ICommandService from './types/command.service.type';
import { Context } from 'telegraf';
import IApiAdapter from '../adapters/types/adapter.type';

class CommandService implements ICommandService {
  container: IApiAdapter[];

  constructor(apiAdapters: IApiAdapter[]) {
    this.container = apiAdapters;
  }
  start(ctx: Context) {
    ctx.reply('Welcome!');
  }

  getPrice(ctx: Context) {
    ctx.reply('admin', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Binance', callback_data: 'exchange-set-binance' }],
        ],
      },
    });
  }

  exchanges(ctx: Context) {
    ctx.reply('Hello');
  }

  myExchanges(ctx: Context) {
    ctx.reply('az');
  }
  setExchange(ctx: Context) {
    ctx.reply('Exchange setted!');
  }
}

export default CommandService;
