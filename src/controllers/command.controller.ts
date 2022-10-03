import { Context } from 'telegraf';
import CommandService from '../services/command.service';

class CommandController {
  constructor(private readonly commandService: CommandService) {}
  Start(ctx: Context) {
    return this.commandService.start(ctx);
  }
  Exchanges(ctx: Context) {
    return this.commandService.exchanges(ctx);
  }
  MyExchanges(ctx: Context) {
    return this.commandService.myExchanges(ctx);
  }
  Price(ctx: Context) {
    return this.commandService.getPrice(ctx);
  }
  MaxPrice(ctx: Context) {
    return this.commandService.maxPrice(ctx);
  }
  MinPrice(ctx: Context) {
    return this.commandService.minPrice(ctx);
  }
}

export default CommandController;
