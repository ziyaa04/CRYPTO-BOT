import ICommandController from './types/command.controller.type';
import { Context } from 'telegraf';
import ICommandService from '../services/types/command.service.type';

class CommandController implements ICommandController {
  constructor(private readonly commandService: ICommandService) {}
  Start(ctx: Context) {
    return this.commandService.start(ctx);
  }
  ExchangesCommand(ctx: Context) {
    return this.commandService.exchanges(ctx);
  }

  MyExchangesCommand(ctx: Context) {
    return this.commandService.myExchanges(ctx);
  }

  PriceCommand(ctx: Context) {
    return this.commandService.getPrice(ctx);
  }
  SetExchangeAction(ctx: Context) {
    return this.commandService.setExchange(ctx);
  }
}

export default CommandController;
