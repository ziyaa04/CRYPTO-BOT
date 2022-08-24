import { Context } from 'telegraf';

interface ICommandController {
  Start(ctx: Context);
  PriceCommand(ctx: Context);
  ExchangesCommand(ctx: Context);
  MyExchangesCommand(ctx: Context);
  SetExchangeAction(ctx: Context);
}

export default ICommandController;
