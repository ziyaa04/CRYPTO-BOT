import ICommandService from './types/command.service.type';
import { Context } from 'telegraf';
import IApiAdapter, {
  ApiAdaptersGenerator,
} from '../adapters/types/adapter.type';

class CommandService implements ICommandService {
  container: IApiAdapter[];

  constructor(apiAdapters: IApiAdapter[]) {
    this.container = apiAdapters;
  }

  getPrice(ctx: Context) {
    ctx.reply('admin');
  }

  exchanges(ctx: Context) {}

  myExchanges(ctx: Context) {}
}

export default CommandService;
