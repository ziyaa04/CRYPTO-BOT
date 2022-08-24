import ICommandService from './types/command.service.type';
import { Context } from 'telegraf';
import IApiAdapter from '../adapters/types/adapter.type';

class CommandService implements ICommandService {
  container: IApiAdapter[];

  constructor(apiAdapters: IApiAdapter[]) {
    this.container = apiAdapters;
  }

  getPrice(ctx: Context) {
    console.log(ctx['user']);
    ctx.reply('admin');
  }

  exchanges(ctx: Context) {
    ctx.reply('Hello');
  }

  myExchanges(ctx: Context) {
    ctx.reply('az');
  }
}

export default CommandService;
