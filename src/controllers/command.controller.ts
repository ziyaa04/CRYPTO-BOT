import ICommandController from './types/command.controller.type';
import { Context } from 'telegraf';
import ICommandService from '../services/types/command.service.type';

class CommandController implements ICommandController {
  constructor(private readonly commandService: ICommandService) {}

  Exchanges(ctx: Context) {}

  MyExchanges(ctx: Context) {
    return ctx.reply('What!');
  }

  Price(ctx: Context) {
    return ctx.reply('Hello!');
  }
}

export default CommandController;
