import ICommandController from './types/command.controller.type';
import { Context } from 'telegraf';
import ICommandService from '../services/types/command.service.type';

class CommandController implements ICommandController {
  constructor(private readonly commandService: ICommandService) {}

  Exchanges(ctx: Context) {
    return this.commandService.exchanges(ctx);
  }

  MyExchanges(ctx: Context) {
    return this.commandService.myExchanges(ctx);
  }

  Price(ctx: Context) {
    return this.commandService.getPrice(ctx);
  }
}

export default CommandController;
